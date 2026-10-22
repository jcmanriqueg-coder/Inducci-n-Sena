import confetti from 'canvas-confetti';
import { ApprenticeProfile, UserInductionProgress, ApprenticeStudentRecord } from '../types';

const PROFILE_KEY = 'sena_apprentice_profile_v1';
const PROGRESS_KEY = 'sena_induction_progress_v1';
const THEME_KEY = 'sena_app_theme_v1';
const ROLE_KEY = 'sena_app_user_role_v1';
const APPRENTICES_REGISTRY_KEY = 'sena_apprentices_records_v1';

export function getStoredRole(): 'aprendiz' | 'instructor' {
  try {
    // 1. Prioritize URL query param e.g. ?rol=aprendiz or ?rol=instructor
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryRole = urlParams.get('rol') || urlParams.get('role');
      if (queryRole === 'instructor') {
        saveStoredRole('instructor');
        return 'instructor';
      }
      if (queryRole === 'aprendiz' || queryRole === 'estudiante') {
        saveStoredRole('aprendiz');
        return 'aprendiz';
      }
    }

    // 2. Check localStorage
    const saved = localStorage.getItem(ROLE_KEY);
    if (saved === 'instructor' || saved === 'aprendiz') {
      return saved;
    }
  } catch (e) {
    console.error('Error reading role', e);
  }
  return 'aprendiz';
}

export function saveStoredRole(role: 'aprendiz' | 'instructor'): void {
  try {
    localStorage.setItem(ROLE_KEY, role);
  } catch (e) {
    console.error('Error saving role', e);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'dark' || raw === 'light') return raw;
  } catch (e) {
    console.error('Error reading theme', e);
  }
  return 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Error saving theme', e);
  }
}

const LANGUAGE_KEY = 'sena_app_language_v1';

export type AppLanguage = 'es' | 'en';

export function getStoredLanguage(): AppLanguage {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryLang = urlParams.get('lang') || urlParams.get('idioma');
      if (queryLang === 'en' || queryLang === 'es') {
        saveStoredLanguage(queryLang);
        return queryLang;
      }
    }
    const raw = localStorage.getItem(LANGUAGE_KEY);
    if (raw === 'en' || raw === 'es') return raw;
  } catch (e) {
    console.error('Error reading language', e);
  }
  return 'es';
}

export function saveStoredLanguage(lang: AppLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error('Error saving language', e);
  }
}

export const DEFAULT_PROFILE: ApprenticeProfile = {

  fullName: 'Juan Camilo Gómez Manrique',
  documentType: 'CC',
  documentNumber: '1098765432',
  email: 'jcmanriqueg@gmail.com',
  regional: 'Regional Distrito Capital',
  centroFormacion: 'Centro de Gestión de Mercados, Logística y Tecnologías de la Información',
  programaFormacion: 'Análisis y Desarrollo de Software (ADSO)',
  numeroFicha: '2879410',
  fechaIngreso: 'Octubre de 2024'
};

/**
 * Progreso inicial limpio para cualquier aprendiz que se registra por primera vez.
 * Inicia estrictamente desde cero: 0 módulos, 0 escenarios, sin evaluaciones aprobadas.
 */
export function createInitialProgress(): UserInductionProgress {
  return {
    completedModules: [],
    completedScenarios: [],
    quizScores: {},
    totalXp: 100, // Bono de bienvenida institucional para inicio de inducción
    streakDays: 1,
    badges: [],
    isCertified: false,
  };
}

export const DEFAULT_PROGRESS: UserInductionProgress = createInitialProgress();

/**
 * Normaliza la clave única de identificación para un aprendiz
 */
export function getApprenticeStorageKey(docType: string, docNumber: string): string {
  const cleanType = (docType || 'CC').trim().toUpperCase();
  const cleanNumber = (docNumber || '').trim().replace(/[^a-zA-Z0-9]/g, '');
  return `${cleanType}_${cleanNumber}`;
}

/**
 * Obtiene el registro completo de aprendices almacenados localmente
 */
export function getApprenticesRegistry(): Record<string, ApprenticeStudentRecord> {
  try {
    const raw = localStorage.getItem(APPRENTICES_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading apprentices registry', e);
  }
  return {};
}

/**
 * Guarda el mapa del registro de aprendices
 */
export function saveApprenticesRegistry(registry: Record<string, ApprenticeStudentRecord>): void {
  try {
    localStorage.setItem(APPRENTICES_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error('Error saving apprentices registry', e);
  }
}

/**
 * Busca si existe un aprendiz previamente registrado por su número de documento
 */
export function findApprenticeRecord(docType: string, docNumber: string): ApprenticeStudentRecord | null {
  if (!docNumber || !docNumber.trim()) return null;
  const key = getApprenticeStorageKey(docType, docNumber);
  const registry = getApprenticesRegistry();

  if (registry[key]) {
    return registry[key];
  }

  // Búsqueda flexible por número de documento limpio por si cambia el tipo
  const cleanNum = docNumber.trim().replace(/[^a-zA-Z0-9]/g, '');
  for (const k of Object.keys(registry)) {
    const record = registry[k];
    if (record?.profile?.documentNumber?.trim().replace(/[^a-zA-Z0-9]/g, '') === cleanNum) {
      return record;
    }
  }

  return null;
}

/**
 * Guarda o actualiza el registro histórico de un aprendiz específico
 */
export function saveOrUpdateApprenticeRecord(
  profile: ApprenticeProfile,
  progress: UserInductionProgress
): void {
  if (!profile.documentNumber || !profile.documentNumber.trim()) return;
  const key = getApprenticeStorageKey(profile.documentType, profile.documentNumber);
  const registry = getApprenticesRegistry();
  const existing = registry[key];
  const now = new Date().toISOString();

  registry[key] = {
    profile: { ...profile },
    progress: { ...progress },
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  saveApprenticesRegistry(registry);
}

/**
 * Obtiene la lista completa de todos los aprendices registrados en este navegador
 */
export function getAllApprenticeRecords(): ApprenticeStudentRecord[] {
  const registry = getApprenticesRegistry();
  return Object.values(registry);
}

export function getStoredProfile(): ApprenticeProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveStoredProfile(profile: ApprenticeProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    // Sincronizar en el registro individual de aprendices
    const currentProgress = getStoredProgress();
    saveOrUpdateApprenticeRecord(profile, currentProgress);
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function getStoredProgress(): UserInductionProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored progress', e);
  }
  return createInitialProgress();
}

export function saveStoredProgress(progress: UserInductionProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    // Sincronizar en el registro individual de aprendices
    const currentProfile = getStoredProfile();
    saveOrUpdateApprenticeRecord(currentProfile, progress);
  } catch (e) {
    console.error('Error saving progress', e);
  }
}


export function triggerConfetti(level: 'small' | 'medium' | 'epic' = 'medium') {
  try {
    if (level === 'small') {
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#39A900', '#00324D', '#F9A825', '#FFFFFF']
      });
    } else if (level === 'medium') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39A900', '#00324D', '#FFB703', '#FFFFFF']
      });
    } else {
      // Epic completion blast
      const end = Date.now() + 2 * 1000;
      const interval: any = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#39A900', '#00324D', '#FFB703', '#FFFFFF', '#0284C7']
        });
      }, 250);
    }
  } catch (err) {
    // Graceful fallback if confetti fails
  }
}

// Web Audio API simple tones for gamified feedback
export function playSound(type: 'correct' | 'wrong' | 'levelup' | 'click') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'levelup') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (e) {
    // Audio context not allowed until interaction or unavailable
  }
}
