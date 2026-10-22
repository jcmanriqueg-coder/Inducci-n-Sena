/**
 * @file src/utils/googleSheets.ts
 * Servicio de integración con Google Sheets y Google Drive utilizando las credenciales de Firebase.
 * 
 * Permite:
 * 1. Autenticar al usuario mediante Firebase Auth con GoogleAuthProvider y scopes de Google Workspace.
 * 2. Gestionar el token de acceso de forma segura en memoria (sin persistir en almacenamiento local).
 * 3. Crear o localizar automáticamente la hoja de cálculo de inducción en Google Drive.
 * 4. Registrar y escribir el progreso del aprendiz (módulos, casos, notas y certificado).
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '@/firebase-applet-config.json';
import { ApprenticeProfile, UserInductionProgress, InstructorApprenticeRecord } from '../types';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

export const DEFAULT_SPREADSHEET_TITLE = 'Registro Inducción SENA 2025 - Aprendices';
export const DEFAULT_SHEET_TAB = 'Aprendices Inducción';

// Column headers for the SENA induction spreadsheet
export const SPREADSHEET_HEADERS = [
  'Fecha de Registro',
  'Nombres y Apellidos',
  'Tipo Documento',
  'Número de Documento',
  'Correo Electrónico',
  'Programa de Formación',
  'Número de Ficha',
  'Regional SENA',
  'Centro de Formación',
  'Puntaje Examen Final (%)',
  'Módulos Completados',
  'Casos Resueltos',
  'Total XP Acumulada',
  'Estado Inducción',
  'Código de Certificado',
  'Fecha Certificación',
];

// Initialize Firebase safely
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);

// Configure Google Auth Provider with Workspace Scopes
const googleProvider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => googleProvider.addScope(scope));
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token storage (Security requirement: never in localStorage)
let memoryAccessToken: string | null = null;
let isAuthenticating = false;

export interface SpreadsheetMetadata {
  id: string;
  title: string;
  url: string;
}

export interface SyncResult {
  success: boolean;
  spreadsheetId: string;
  spreadsheetUrl: string;
  message: string;
}

/**
 * Escucha los cambios de autenticación del usuario
 */
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(firebaseAuth, async (user: User | null) => {
    if (user) {
      if (memoryAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, memoryAccessToken);
      } else if (!isAuthenticating) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      memoryAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Solicita token de acceso directamente mediante Google Identity Services (GIS)
 * como respaldo infalible cuando Firebase Auth encuentra restricciones de iframe en entorno web.
 */
export const requestAccessTokenViaGIS = async (): Promise<string | null> => {
  const clientId = (firebaseConfig as any).oAuthClientId;
  if (!clientId || typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    let hasResolved = false;
    const safeResolve = (token: string | null) => {
      if (!hasResolved) {
        hasResolved = true;
        resolve(token);
      }
    };

    const tryInit = () => {
      const google = (window as any).google;
      if (google?.accounts?.oauth2) {
        try {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: WORKSPACE_SCOPES.join(' '),
            callback: (response: any) => {
              if (response?.error) {
                console.warn('Aviso Google Identity Services:', response.error);
                safeResolve(null);
              } else if (response?.access_token) {
                safeResolve(response.access_token);
              } else {
                safeResolve(null);
              }
            },
            error_callback: (err: any) => {
              console.warn('Ventana emergente de Google cerrada o cancelada:', err);
              safeResolve(null);
            },
          });
          client.requestAccessToken({ prompt: 'select_account' });
        } catch (e) {
          console.warn('Error al inicializar cliente GIS:', e);
          safeResolve(null);
        }
      } else {
        safeResolve(null);
      }
    };

    if ((window as any).google?.accounts?.oauth2) {
      tryInit();
    } else {
      setTimeout(tryInit, 600);
    }
  });
};

/**
 * Inicia sesión con Google mediante Firebase Auth y obtiene el token de acceso de Workspace.
 * Dispone de conmutación por error automática con Google Identity Services para garantizar
 * disponibilidad incluso bajo restricciones de cross-origin iframes.
 */
export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isAuthenticating = true;

    // Estrategia 1: Intentar flujo estándar de Firebase Auth signInWithPopup
    try {
      const credentialResult = await signInWithPopup(firebaseAuth, googleProvider);
      const oauthCreds = GoogleAuthProvider.credentialFromResult(credentialResult);

      if (oauthCreds?.accessToken) {
        memoryAccessToken = oauthCreds.accessToken;
        return {
          user: credentialResult.user,
          accessToken: memoryAccessToken,
        };
      }
    } catch (fbErr: any) {
      // Si el usuario cerró la ventana emergente intencionalmente o canceló, salir limpiamente
      if (
        fbErr?.code === 'auth/popup-closed-by-user' ||
        fbErr?.code === 'auth/cancelled-popup-request'
      ) {
        return null;
      }

      // Si ocurre internal-error u otra restricción de iframe en vista previa, intentar Estrategia 2
      console.warn('Aviso Firebase Auth (reintentando con cliente Google Identity):', fbErr?.message || fbErr);
    }

    // Estrategia 2: Cliente directo de Google Identity Services (GIS)
    const gisToken = await requestAccessTokenViaGIS();
    if (gisToken) {
      memoryAccessToken = gisToken;

      // Obtener datos del perfil de Google
      let userObj: any = firebaseAuth.currentUser;
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${gisToken}` },
        });
        if (userInfoRes.ok) {
          const info = await userInfoRes.json();
          userObj = {
            uid: info.sub || 'google-user',
            email: info.email || 'instructor@sena.edu.co',
            displayName: info.name || 'Instructor SENA',
            photoURL: info.picture || '',
          };
        }
      } catch (e) {
        if (!userObj) {
          userObj = {
            uid: 'google-user',
            email: 'instructor@sena.edu.co',
            displayName: 'Instructor SENA',
          };
        }
      }

      // Sincronizar credencial con Firebase Auth si es posible
      try {
        const cred = GoogleAuthProvider.credential(null, gisToken);
        const fbUserCred = await signInWithCredential(firebaseAuth, cred);
        userObj = fbUserCred.user;
      } catch (e) {
        // Ignorar si el dominio no está autorizado en consola Firebase
      }

      return {
        user: userObj as User,
        accessToken: gisToken,
      };
    }

    return null;
  } catch (err: any) {
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request'
    ) {
      return null;
    }
    console.warn('Aviso durante autenticación Google:', err?.message || err);
    return null;
  } finally {
    isAuthenticating = false;
  }
};

/**
 * Obtiene el token de acceso actual en memoria
 */
export const getGoogleAccessToken = (): string | null => {
  return memoryAccessToken;
};

/**
 * Cierra la sesión activa de Google y limpia el token en memoria
 */
export const signOutGoogle = async (): Promise<void> => {
  await signOut(firebaseAuth);
  memoryAccessToken = null;
};

/**
 * Busca si la hoja de cálculo de inducción ya existe en Google Drive
 */
export const findSpreadsheetInDrive = async (
  accessToken: string,
  title: string = DEFAULT_SPREADSHEET_TITLE
): Promise<SpreadsheetMetadata | null> => {
  const query = encodeURIComponent(
    `name = '${title}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.warn('Aviso al consultar archivos en Google Drive:', errorText);
    return null;
  }

  const json = await res.json();
  if (json.files && json.files.length > 0) {
    const file = json.files[0];
    return {
      id: file.id,
      title: file.name,
      url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}`,
    };
  }

  return null;
};

/**
 * Crea una nueva hoja de cálculo en Google Drive con la estructura del SENA
 */
export const createInductionSpreadsheet = async (
  accessToken: string,
  title: string = DEFAULT_SPREADSHEET_TITLE
): Promise<SpreadsheetMetadata> => {
  // 1. Crear el libro y la pestaña inicial
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: DEFAULT_SHEET_TAB,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Fallo al crear hoja de cálculo: ${err}`);
  }

  const data = await createRes.json();
  const spreadsheetId = data.spreadsheetId;
  const webViewLink =
    data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  // 2. Insertar fila de encabezados
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      DEFAULT_SHEET_TAB
    )}!A1:P1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [SPREADSHEET_HEADERS],
      }),
    }
  );

  // 3. Estilo institucional (Verde SENA #39A900, texto blanco en negrita)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SPREADSHEET_HEADERS.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.223, // #39A900 Verde SENA
                    green: 0.662,
                    blue: 0.0,
                  },
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                    bold: true,
                    fontSize: 10,
                  },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: SPREADSHEET_HEADERS.length,
              },
            },
          },
        ],
      }),
    });
  } catch (formatErr) {
    console.warn('Formato estilizado omitido por compatibilidad:', formatErr);
  }

  return {
    id: spreadsheetId,
    title,
    url: webViewLink,
  };
};

/**
 * Obtiene la hoja existente o crea una nueva si no existe
 */
export const getOrCreateSpreadsheet = async (
  accessToken: string,
  title: string = DEFAULT_SPREADSHEET_TITLE
): Promise<SpreadsheetMetadata> => {
  const existing = await findSpreadsheetInDrive(accessToken, title);
  if (existing) {
    return existing;
  }
  return await createInductionSpreadsheet(accessToken, title);
};

// Cache in-memory for the resolved spreadsheet in current session
let cachedSpreadsheetMeta: SpreadsheetMetadata | null = null;

export const setCachedSpreadsheetMeta = (meta: SpreadsheetMetadata | null) => {
  cachedSpreadsheetMeta = meta;
};

export const getCachedSpreadsheetMeta = (): SpreadsheetMetadata | null => {
  return cachedSpreadsheetMeta;
};

/**
 * Transforma el perfil y progreso del aprendiz a la estructura de celdas de la fila
 */
export const formatApprenticeRow = (
  profile: ApprenticeProfile,
  progress: UserInductionProgress
): (string | number)[] => {
  const timestamp = new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date());

  const examScoreText =
    progress.finalExamScore !== undefined && progress.finalExamScore !== null
      ? `${progress.finalExamScore}%`
      : 'Pendiente';

  const statusText = progress.isCertified
    ? 'CERTIFICADO (Aprobado)'
    : progress.completedModules.length === 6
    ? 'Listo para Evaluación'
    : `En Formación (${progress.completedModules.length}/6)`;

  return [
    timestamp,
    profile.fullName,
    profile.documentType,
    profile.documentNumber,
    profile.email || 'No registrado',
    profile.programaFormacion,
    profile.numeroFicha,
    profile.regional,
    profile.centroFormacion,
    examScoreText,
    `${progress.completedModules.length} de 6`,
    `${progress.completedScenarios.length} de 4`,
    `${progress.totalXp} XP`,
    statusText,
    progress.certificateCode || 'Pendiente',
    progress.certifiedDate || 'Pendiente',
  ];
};

/**
 * Agrega una fila con el progreso del aprendiz en la hoja de Google Sheets
 */
export const writeApprenticeProgress = async (
  accessToken: string,
  spreadsheetId: string,
  profile: ApprenticeProfile,
  progress: UserInductionProgress
): Promise<boolean> => {
  const rowValues = formatApprenticeRow(profile, progress);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      DEFAULT_SHEET_TAB
    )}!A:P:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al escribir el progreso en Google Sheets: ${errorText}`);
  }

  return true;
};

/**
 * Realiza un Upsert (actualiza la fila existente si el aprendiz ya está registrado por número de documento,
 * o añade una nueva fila al final de la tabla si no existe).
 */
export const upsertApprenticeProgress = async (
  accessToken: string,
  spreadsheetId: string,
  profile: ApprenticeProfile,
  progress: UserInductionProgress
): Promise<{ updated: boolean; rowIndex: number }> => {
  const rowValues = formatApprenticeRow(profile, progress);
  const docNumber = String(profile.documentNumber).trim();

  // 1. Consultar columna D (Número de Documento) para ubicar si el aprendiz ya existe
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        DEFAULT_SHEET_TAB
      )}!D:D`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (checkRes.ok) {
      const data = await checkRes.json();
      const rows = data.values as string[][] | undefined;

      if (rows && rows.length > 1 && docNumber) {
        // Encontrar índice de fila (ignorar fila 1 de encabezados)
        let foundRowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
          const val = rows[i]?.[0];
          if (val && String(val).trim() === docNumber) {
            foundRowIndex = i + 1; // 1-indexed para A1 notation en Sheets
            break;
          }
        }

        // Si se encontró, actualizar la fila existente
        if (foundRowIndex > 0) {
          const updateRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
              DEFAULT_SHEET_TAB
            )}!A${foundRowIndex}:P${foundRowIndex}?valueInputOption=USER_ENTERED`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                values: [rowValues],
              }),
            }
          );

          if (updateRes.ok) {
            return { updated: true, rowIndex: foundRowIndex };
          }
        }
      }
    }
  } catch (searchErr) {
    console.warn('Búsqueda de fila existente falló, procediendo con append:', searchErr);
  }

  // Si no se encontró o la búsqueda falló, agregar nueva fila al final
  await writeApprenticeProgress(accessToken, spreadsheetId, profile, progress);
  return { updated: false, rowIndex: -1 };
};

/**
 * Función integral de alto nivel:
 * 1. Obtiene el token de autenticación
 * 2. Encuentra o crea la hoja de cálculo en Drive (usando caché para máximo rendimiento)
 * 3. Actualiza o escribe los datos del aprendiz mediante upsert
 */
export const saveApprenticeToGoogleSheets = async (
  profile: ApprenticeProfile,
  progress: UserInductionProgress,
  customTitle?: string
): Promise<SyncResult> => {
  const token = getGoogleAccessToken();
  if (!token) {
    throw new Error(
      'No hay sesión activa de Google con credenciales de Firebase. Inicia sesión para continuar.'
    );
  }

  // 1. Obtener o crear hoja en Drive (reutilizando caché si está disponible)
  let sheetMeta = cachedSpreadsheetMeta;
  if (!sheetMeta || (customTitle && sheetMeta.title !== customTitle)) {
    sheetMeta = await getOrCreateSpreadsheet(token, customTitle || DEFAULT_SPREADSHEET_TITLE);
    cachedSpreadsheetMeta = sheetMeta;
  }

  // 2. Realizar upsert del progreso del aprendiz
  const result = await upsertApprenticeProgress(token, sheetMeta.id, profile, progress);

  return {
    success: true,
    spreadsheetId: sheetMeta.id,
    spreadsheetUrl: sheetMeta.url,
    message: result.updated
      ? `Fila de ${profile.fullName} actualizada con éxito en la hoja de Google Sheets.`
      : `El progreso del aprendiz ${profile.fullName} fue registrado como nuevo en Google Sheets.`,
  };
};

/**
 * Consulta y retorna todas las filas de aprendices registrados en la hoja de Google Sheets
 */
export const fetchApprenticesFromSheet = async (
  accessToken: string,
  spreadsheetId: string
): Promise<InstructorApprenticeRecord[]> => {
  const range = `${encodeURIComponent(DEFAULT_SHEET_TAB)}!A2:P`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al leer los aprendices de Google Sheets: ${errorText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows.map((row, idx) => ({
    timestamp: row[0] || '',
    fullName: row[1] || 'Sin nombre',
    documentType: row[2] || 'CC',
    documentNumber: row[3] || '',
    email: row[4] || '',
    programaFormacion: row[5] || '',
    numeroFicha: row[6] || '',
    regional: row[7] || '',
    centroFormacion: row[8] || '',
    finalExamScore: row[9] || 'Pendiente',
    completedModules: row[10] || '0 de 6',
    completedScenarios: row[11] || '0 de 4',
    totalXp: row[12] || '0 XP',
    status: row[13] || 'En Formación',
    certificateCode: row[14] || 'Pendiente',
    certifiedDate: row[15] || 'Pendiente',
    rawRowIndex: idx + 2,
  }));
};


