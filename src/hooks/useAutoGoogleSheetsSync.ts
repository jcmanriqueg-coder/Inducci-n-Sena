/**
 * @file src/hooks/useAutoGoogleSheetsSync.ts
 * Hook de sincronización automática y en segundo plano con Google Sheets.
 * 
 * Gestiona:
 * 1. Detección automática del estado de autenticación de Google con Firebase.
 * 2. Detección de cambios en el perfil y progreso del aprendiz (módulos, casos, examen, certificado).
 * 3. Ejecución silenciosa y debounced de upsert en Google Sheets.
 * 4. Estado de sincronización en tiempo real para el indicador visual de la barra de navegación.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ApprenticeProfile, UserInductionProgress } from '../types';
import {
  firebaseAuth,
  getGoogleAccessToken,
  signInWithGoogle,
  signOutGoogle,
  saveApprenticeToGoogleSheets,
  getCachedSpreadsheetMeta,
  getOrCreateSpreadsheet,
} from '../utils/googleSheets';
import { onAuthStateChanged, User } from 'firebase/auth';

export type CloudSyncState = 'unauthenticated' | 'idle' | 'syncing' | 'synced' | 'error';

interface UseAutoGoogleSheetsSyncProps {
  profile: ApprenticeProfile;
  progress: UserInductionProgress;
  enabled?: boolean;
  debounceMs?: number;
}

export interface UseAutoGoogleSheetsSyncReturn {
  syncState: CloudSyncState;
  lastSyncedAt: Date | null;
  spreadsheetUrl: string | null;
  userEmail: string | null;
  errorMessage: string | null;
  connectGoogleAccount: () => Promise<boolean>;
  disconnectGoogleAccount: () => Promise<void>;
  forceSync: () => Promise<boolean>;
}

export function useAutoGoogleSheetsSync({
  profile,
  progress,
  enabled = true,
  debounceMs = 1200,
}: UseAutoGoogleSheetsSyncProps): UseAutoGoogleSheetsSyncReturn {
  const [currentUser, setCurrentUser] = useState<User | null>(firebaseAuth.currentUser);
  const [syncState, setSyncState] = useState<CloudSyncState>(
    getGoogleAccessToken() ? 'idle' : 'unauthenticated'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(
    getCachedSpreadsheetMeta()?.url || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References for debounce, in-flight state, and data fingerprinting
  const lastSyncedFingerprintRef = useRef<string>('');
  const debounceTimerRef = useRef<number | null>(null);
  const isSyncingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  // Calculate payload fingerprint to prevent duplicate network calls
  const computeFingerprint = useCallback(
    (prof: ApprenticeProfile, prog: UserInductionProgress) => {
      return JSON.stringify({
        doc: prof.documentNumber,
        name: prof.fullName,
        type: prof.documentType,
        ficha: prof.numeroFicha,
        regional: prof.regional,
        mods: [...prog.completedModules].sort(),
        scenarios: [...prog.completedScenarios].sort(),
        certified: prog.isCertified,
        examScore: prog.finalExamScore ?? null,
        certCode: prog.certificateCode ?? null,
      });
    },
    []
  );

  // Monitor Firebase Auth state
  useEffect(() => {
    isMountedRef.current = true;
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!isMountedRef.current) return;
      setCurrentUser(user);
      const token = getGoogleAccessToken();
      if (user && token) {
        setSyncState((prev) => (prev === 'unauthenticated' ? 'idle' : prev));
      } else {
        setSyncState('unauthenticated');
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Ejecuta el guardado directo en Google Sheets
   */
  const performSync = useCallback(
    async (
      targetProfile: ApprenticeProfile,
      targetProgress: UserInductionProgress,
      isManual: boolean = false
    ): Promise<boolean> => {
      const token = getGoogleAccessToken();
      if (!token) {
        if (isMountedRef.current) {
          setSyncState('unauthenticated');
        }
        return false;
      }

      if (isSyncingRef.current) {
        return false;
      }

      const currentFingerprint = computeFingerprint(targetProfile, targetProgress);
      // Skip redundant sync if data has not changed since last successful sync (unless manual)
      if (!isManual && lastSyncedFingerprintRef.current === currentFingerprint) {
        return true;
      }

      isSyncingRef.current = true;
      if (isMountedRef.current) {
        setSyncState('syncing');
        setErrorMessage(null);
      }

      try {
        const result = await saveApprenticeToGoogleSheets(targetProfile, targetProgress);

        if (isMountedRef.current) {
          lastSyncedFingerprintRef.current = currentFingerprint;
          setLastSyncedAt(new Date());
          setSpreadsheetUrl(result.spreadsheetUrl);
          setSyncState('synced');
          setErrorMessage(null);
        }
        return true;
      } catch (err: any) {
        console.warn('Aviso durante auto-sincronización con Google Sheets:', err);
        if (isMountedRef.current) {
          setSyncState('error');
          setErrorMessage(err?.message || 'Error al sincronizar con Google Sheets');
        }
        return false;
      } finally {
        isSyncingRef.current = false;
      }
    },
    [computeFingerprint]
  );

  /**
   * Efecto de sincronización automática ante cambios de progreso o perfil
   */
  useEffect(() => {
    if (!enabled) return;

    const token = getGoogleAccessToken();
    if (!token) {
      setSyncState('unauthenticated');
      return;
    }

    const currentFingerprint = computeFingerprint(profile, progress);
    if (currentFingerprint === lastSyncedFingerprintRef.current) {
      return;
    }

    // Cancel previous debounce timer
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    // Set debounced sync
    debounceTimerRef.current = window.setTimeout(() => {
      performSync(profile, progress, false);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [profile, progress, enabled, debounceMs, computeFingerprint, performSync]);

  /**
   * Iniciar sesión con Google y sincronizar inmediatamente
   */
  const connectGoogleAccount = useCallback(async (): Promise<boolean> => {
    try {
      setSyncState('syncing');
      setErrorMessage(null);
      const authResult = await signInWithGoogle();
      if (!authResult) {
        // Usuario cerró el popup de autenticación
        setSyncState('unauthenticated');
        return false;
      }

      setCurrentUser(authResult.user);

      // Pre-cargar metadatos de la hoja y sincronizar
      const sheet = await getOrCreateSpreadsheet(authResult.accessToken);
      setSpreadsheetUrl(sheet.url);

      const ok = await performSync(profile, progress, true);
      return ok;
    } catch (err: any) {
      setSyncState('error');
      setErrorMessage(err?.message || 'No se pudo conectar con la cuenta de Google');
      return false;
    }
  }, [profile, progress, performSync]);

  /**
   * Cerrar sesión de Google
   */
  const disconnectGoogleAccount = useCallback(async (): Promise<void> => {
    await signOutGoogle();
    setCurrentUser(null);
    setSyncState('unauthenticated');
    setLastSyncedAt(null);
  }, []);

  /**
   * Forzar sincronización manual inmediata
   */
  const forceSync = useCallback(async (): Promise<boolean> => {
    return await performSync(profile, progress, true);
  }, [profile, progress, performSync]);

  return {
    syncState,
    lastSyncedAt,
    spreadsheetUrl,
    userEmail: currentUser?.email || null,
    errorMessage,
    connectGoogleAccount,
    disconnectGoogleAccount,
    forceSync,
  };
}
