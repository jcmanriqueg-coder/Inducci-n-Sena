import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  CloudCheck, 
  Database, 
  ShieldCheck, 
  LogOut, 
  User, 
  Send,
  HelpCircle
} from 'lucide-react';
import { ApprenticeProfile, UserInductionProgress } from '../types';
import {
  googleSignIn,
  googleSignOut,
  initAuth,
  getAccessToken,
  syncApprenticeDataToGoogleSheets,
  findExistingSpreadsheet,
  SpreadsheetInfo,
} from '../services/googleDriveSheetsService';
import { User as FirebaseUser } from 'firebase/auth';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  progress: UserInductionProgress;
  onSyncSuccess?: (sheetUrl: string) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  progress,
  onSyncSuccess,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<SpreadsheetInfo | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
    url?: string;
  }>({ type: 'idle' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Monitor auth state on modal mount
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setCurrentUser(user);
        try {
          const existingSheet = await findExistingSpreadsheet(token);
          if (existingSheet) {
            setSpreadsheetInfo(existingSheet);
          }
        } catch (e) {
          console.warn('No se pudo verificar hoja existente:', e);
        }
      },
      () => {
        setCurrentUser(null);
        setSpreadsheetInfo(null);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setSyncStatus({ type: 'idle' });
    try {
      const authResult = await googleSignIn();
      if (!authResult) {
        // El usuario cerró la ventana emergente de forma voluntaria
        return;
      }
      const { user, accessToken } = authResult;
      setCurrentUser(user);
      const sheet = await findExistingSpreadsheet(accessToken);
      if (sheet) {
        setSpreadsheetInfo(sheet);
      }
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request'
      ) {
        // Salir limpiamente si se canceló
        return;
      }
      if (error?.code === 'auth/popup-blocked') {
        setSyncStatus({
          type: 'error',
          message:
            'La ventana emergente de Google fue bloqueada por tu navegador. Permite las ventanas emergentes (pop-ups) e inténtalo de nuevo.',
        });
        return;
      }
      console.warn('Inicio de sesión Google no completado:', error);
      setSyncStatus({
        type: 'error',
        message:
          error?.message ||
          'No se pudo conectar con Google. Verifica que las ventanas emergentes estén permitidas.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setSpreadsheetInfo(null);
    setSyncStatus({ type: 'idle' });
  };

  // Trigger confirmation dialog for mutating data
  const handleRequestSync = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmAndSync = async () => {
    setShowConfirmDialog(false);
    setIsSyncing(true);
    setSyncStatus({ type: 'idle' });

    try {
      const result = await syncApprenticeDataToGoogleSheets(profile, progress);
      setSyncStatus({
        type: 'success',
        message: result.message,
        url: result.spreadsheetUrl,
      });
      setSpreadsheetInfo({
        id: 'active',
        title: 'Registro Inducción SENA 2025 - Aprendices',
        url: result.spreadsheetUrl,
      });
      if (onSyncSuccess) {
        onSyncSuccess(result.spreadsheetUrl);
      }
    } catch (error: any) {
      console.warn('Aviso al sincronizar con Google Sheets:', error);
      setSyncStatus({
        type: 'error',
        message:
          error?.message ||
          'Ocurrió un error al registrar los datos en la hoja de cálculo de Google Drive.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#00324D] text-white px-6 py-4 flex items-center justify-between border-b border-transparent dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39A900] flex items-center justify-center text-white shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Sincronización con Google Drive & Sheets
              </h3>
              <p className="text-xs text-slate-300">
                Almacena el registro oficial de aprendices e inducción
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200 text-sm">
          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#39A900] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                Estructura de Hoja de Cálculo en Google Drive
              </strong>
              La plataforma creará y vinculará una hoja de cálculo llamada{' '}
              <span className="font-mono font-semibold text-[#00324D] dark:text-emerald-300">
                "Registro Inducción SENA 2025 - Aprendices"
              </span>{' '}
              en tu unidad de Google Drive, agregando filas con los datos de caracterización, notas de evaluación y código de certificación.
            </div>
          </div>

          {/* User Auth Section */}
          {!currentUser ? (
            <div className="text-center py-6 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-4">
              <div className="max-w-md mx-auto space-y-2">
                <Database className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Conectar cuenta de Google
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inicia sesión con tu cuenta de Google institucional o personal para autorizar la creación y actualización de la hoja en tu Google Drive.
                </p>
              </div>

              {/* Official Google Sign-in Button style */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="group relative inline-flex items-center justify-center gap-3 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl shadow-xs transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#39A900] disabled:opacity-50 cursor-pointer"
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#39A900]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  )}
                  <span>
                    {isSigningIn ? 'Conectando con Google...' : 'Iniciar sesión con Google'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected User Pill */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-600"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#00324D] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{currentUser.displayName || 'Usuario Google'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
                  title="Cerrar sesión de Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>

              {/* Data Preview to be Synced */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>Registro a transferir:</span>
                  <span className="text-[#39A900] font-mono">1 fila a Google Sheets</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Aprendiz:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {profile.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Identificación:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 block">
                      {profile.documentType} {profile.documentNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ficha / Programa:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate block">
                      Ficha {profile.numeroFicha}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estado / Calificación:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {progress.isCertified
                        ? `Aprobado (${progress.finalExamScore}%)`
                        : `${progress.completedModules.length}/6 Módulos`}
                    </span>
                  </div>
                </div>

                {/* Primary Sync Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRequestSync}
                    disabled={isSyncing}
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando en Google Drive...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Sincronizar y Guardar en Hoja de Google Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status / Feedback message */}
              {syncStatus.type === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                    <span>¡Guardado Exitoso en Google Drive!</span>
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300">
                    {syncStatus.message}
                  </p>
                  {syncStatus.url && (
                    <a
                      href={syncStatus.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00324D] dark:text-emerald-400 hover:underline pt-1"
                    >
                      <span>Abrir Hoja de Cálculo en Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {syncStatus.type === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Error en la sincronización:</strong> {syncStatus.message}
                  </div>
                </div>
              )}

              {/* Link to existing spreadsheet if already created */}
              {spreadsheetInfo?.url && syncStatus.type !== 'success' && (
                <div className="text-center pt-1">
                  <a
                    href={spreadsheetInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-[#39A900] dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>Ver hoja de cálculo vinculada en Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <CloudCheck className="w-4 h-4 text-[#39A900]" />
            <span>Google Drive API v3 · Sheets API v4</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>

        {/* Mandatory Confirmation Dialog for mutating Google Workspace data */}
        {showConfirmDialog && (
          <div className="absolute inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#39A900] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Confirmar Registro en Google Sheets
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Operación de almacenamiento en Google Drive
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                ¿Confirmas agregar el registro del aprendiz <strong>{profile.fullName}</strong> (Ficha {profile.numeroFicha}) a la hoja de cálculo <em>"Registro Inducción SENA 2025 - Aprendices"</em> en tu Google Drive?
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndSync}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-lg transition-colors shadow-sm"
                >
                  Sí, Guardar en Google Sheets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
