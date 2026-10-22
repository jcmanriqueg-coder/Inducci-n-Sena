/**
 * Google Workspace (Drive & Sheets) Integration Service
 * Re-exporta y delega en el módulo central de utilidades src/utils/googleSheets.ts
 * garantizando compatibilidad completa y una única instancia de autenticación en memoria.
 */

import { User } from 'firebase/auth';
import { ApprenticeProfile, UserInductionProgress } from '../types';
import {
  firebaseAuth,
  WORKSPACE_SCOPES,
  DEFAULT_SPREADSHEET_TITLE,
  initGoogleAuth,
  signInWithGoogle,
  signOutGoogle,
  getGoogleAccessToken,
  findSpreadsheetInDrive,
  createInductionSpreadsheet,
  getOrCreateSpreadsheet,
  writeApprenticeProgress,
  upsertApprenticeProgress,
  getCachedSpreadsheetMeta,
  setCachedSpreadsheetMeta,
  saveApprenticeToGoogleSheets,
  fetchApprenticesFromSheet,
  SpreadsheetMetadata,
  SyncResult,
} from '../utils/googleSheets';

export const SCOPES = WORKSPACE_SCOPES;
export const auth = firebaseAuth;

export interface ApprenticeSyncRecord {
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  programaFormacion: string;
  numeroFicha: string;
  regional: string;
  centroFormacion: string;
  finalExamScore: number | string;
  completedModulesCount: number;
  completedScenariosCount: number;
  status: string;
  certificateCode: string;
  certifiedDate: string;
}

export type SpreadsheetInfo = SpreadsheetMetadata;

// Adaptadores para mantener compatibilidad con componentes existentes
export const initAuth = initGoogleAuth;
export const googleSignIn = signInWithGoogle;
export const googleSignOut = signOutGoogle;
export const getAccessToken = async (): Promise<string | null> => getGoogleAccessToken();
export const findExistingSpreadsheet = findSpreadsheetInDrive;

export const appendApprenticeToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  record: ApprenticeSyncRecord
): Promise<boolean> => {
  const profile: ApprenticeProfile = {
    fullName: record.fullName,
    documentType: record.documentType as any,
    documentNumber: record.documentNumber,
    email: record.email,
    regional: record.regional,
    centroFormacion: record.centroFormacion,
    programaFormacion: record.programaFormacion,
    numeroFicha: record.numeroFicha,
    fechaIngreso: '',
  };

  const progress: UserInductionProgress = {
    completedModules: Array(record.completedModulesCount).fill('mod'),
    completedScenarios: Array(record.completedScenariosCount).fill('scen'),
    quizScores: {},
    totalXp: 500,
    streakDays: 1,
    badges: [],
    finalExamScore: typeof record.finalExamScore === 'number' ? record.finalExamScore : undefined,
    isCertified: record.status.includes('CERTIFICADO'),
    certificateCode: record.certificateCode,
    certifiedDate: record.certifiedDate,
  };

  return await writeApprenticeProgress(accessToken, spreadsheetId, profile, progress);
};

export const syncApprenticeDataToGoogleSheets = async (
  profile: ApprenticeProfile,
  progress: UserInductionProgress
): Promise<{ success: boolean; spreadsheetUrl: string; message: string }> => {
  const result: SyncResult = await saveApprenticeToGoogleSheets(profile, progress);
  return {
    success: result.success,
    spreadsheetUrl: result.spreadsheetUrl,
    message: result.message,
  };
};

export {
  createInductionSpreadsheet,
  getOrCreateSpreadsheet,
  writeApprenticeProgress,
  upsertApprenticeProgress,
  getCachedSpreadsheetMeta,
  setCachedSpreadsheetMeta,
  saveApprenticeToGoogleSheets,
  fetchApprenticesFromSheet,
};


