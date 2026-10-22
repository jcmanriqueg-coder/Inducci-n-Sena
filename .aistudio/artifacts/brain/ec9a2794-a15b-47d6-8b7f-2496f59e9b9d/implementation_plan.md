# Plan de Sincronización Automática en Segundo Plano con Google Sheets

Sincronización automática y continua del progreso del aprendiz (módulos completados, casos resueltos, nota final y certificación) en una hoja de cálculo alojada en Google Drive, eliminando configuraciones manuales repetitivas mediante una sesión Google unificada y un indicador discreto de estado en la nube.

## User Review & Critical Decisions

> [!IMPORTANT]
> A continuación se resumen las decisiones acordadas durante la fase interactiva de clarificación:

- **Mecanismo de Conexión**: **Sesión Google única con sincronización automática continua**. El aprendiz/instructor conecta su cuenta una única vez al inicio; el sistema retiene la sesión activa y gestiona de forma transparente la creación o reutilización del libro *"Registro Inducción SENA 2025 - Aprendices"* en Google Drive.
- **Momentos de Disparo de Guardado**: **Hitos de avance clave**. La sincronización se ejecuta en segundo plano al:
  1. Completar cualquier módulo de formación.
  2. Resolver un caso ético en el simulador.
  3. Modificar los datos del perfil de aprendiz (con debounce de seguridad).
  4. Aprobar la evaluación final y generar el certificado oficial.
- **Visualización y Retroalimentación**: **Indicador sutil de nube**. Un icono en la barra superior que refleja el estado en tiempo real (`Sincronizado`, `Guardando...`, `Conectar cuenta`, `Sin conexión`) sin interrumpir la navegación del aprendiz con alertas invasivas.

---

## 1. Overview & Core Concept

- **Qué hace**: Automatiza por completo la persistencia del avance académico de los aprendices SENA en Google Sheets. Tras iniciar sesión por primera vez, cada acción relevante (módulos leídos, respuestas del simulador de casos, calificación porcentual de la evaluación de 10 preguntas y código único de certificación) se envía inmediatamente a la hoja de cálculo en Google Drive sin requerir interacción adicional del usuario.
- **Audiencia / Perfil**: Aprendices del SENA en su proceso de inducción y tutores/instructores que necesitan consolidar en tiempo real el registro oficial de inducción en hojas de cálculo institucionales sin pérdida de información ni demoras administrativas.
- **Valor Principal**: Cero fricción operativa: el aprendiz se concentra en su aprendizaje y el instructor obtiene datos centralizados, estructurados y actualizados al instante en Google Sheets.

---

## 2. User Experience & Visual Design

- **Flujo de Usuario**:
  1. **Inicio de Sesión Silencioso**: Al ingresar al prototipo, si la cuenta de Google ya fue vinculada, el prototipo restaura la sesión y detecta automáticamente la hoja de cálculo. Si no ha iniciado sesión, el indicador muestra un botón sutil *"Conectar con Google Drive"*.
  2. **Interacción Habitual**: El aprendiz navega los módulos, responde trivias o resuelve dilemas disciplinarios.
  3. **Disparo en Segundo Plano**: Al pulsar *"Completar Módulo"* o *"Emitir Fallo"*, el prototipo actualiza el estado local de inmediato para ofrecer fluidez de 60 FPS y paralelamente despacha la escritura en Google Sheets.
  4. **Indicador de Nube en la Barra Superior**:
     - *Nube con check verde*: *"Todo sincronizado"*.
     - *Nube con giro suave*: *"Guardando en Google Sheets..."*.
     - *Nube gris o desconectada*: *"Haga clic para vincular Drive"*.
- **Identidad Visual**:
  - Estricta adhesión a la paleta institucional SENA (Verde `#39A900`, fondo slate neutro en modo claro/oscuro, tipografía jerárquica legible).
  - Microinteracción de guardado con transición CSS suave ($\le 200\text{ms}$).
  - Cero alertas modales invasivas durante la lectura de módulos.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Sincronización no bloqueante (Optimistic UI)**
  - *Enfoque*: La interfaz del aprendiz responde instantáneamente a las acciones locales (avance de módulo, XP sumada) y envía la petición HTTP a la API de Google Sheets en una cola de fondo.
  - *Por qué*: Si la red del aprendiz tiene latencia o microcortes, su experiencia educativa nunca se detiene ni se congela la pantalla.
  - *Alternativa descartada*: Bloquear con spinners de carga en cada clic, lo cual degradaría la experiencia de usuario.

- **Decisión 2: Actualización de fila existente vs. Anexar histórico**
  - *Enfoque*: El servicio buscará si ya existe una fila registrada con el número de documento y cédula del aprendiz. Si existe, actualizará sus datos en la misma fila (módulos, puntaje, certificado); si no existe, insertará una nueva fila.
  - *Por qué*: Evita duplicar decenas de registros por cada clic de un mismo aprendiz, manteniendo la hoja de cálculo limpia, ordenada y apta para informes consolidados.
  - *Alternativa descartada*: Insertar siempre una fila nueva al final, lo cual generaría hasta 15 filas repetidas por estudiante.

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Arquitectura y Flujo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Prototipo React (Frontend)                      │
│                                                                        │
│  [Módulos] ──► [Simulador] ──► [Examen] ──► [Perfil Aprendiz]          │
│       │              │             │               │                   │
│       └──────────────┴──────┬──────┴───────────────┘                   │
│                             ▼                                          │
│                 useAutoGoogleSheetsSync Hook                           │
│           (Debounce, cola de peticiones, reintentos)                   │
│                             │                                          │
│     ┌───────────────────────┴───────────────────────┐                  │
│     ▼                                               ▼                  │
│  [Estado UI Local]                        [Servicio Google Sheets]     │
│  (Indicador de Nube)                      (Bearer Token Firebase Auth) │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │ HTTPS OAuth 2.0
                                                      ▼
                       ┌─────────────────────────────────────────────────┐
                       │          Google Workspace Cloud APIs            │
                       │                                                 │
                       │   Google Drive API v3  (Localiza libro SENA)    │
                       │   Google Sheets API v4 (Upsert fila aprendiz)   │
                       └─────────────────────────────────────────────────┘
```

### Componentes y Módulos a Implementar:

1. **`src/hooks/useAutoGoogleSheetsSync.ts`**:
   - Hook personalizado de React que escucha los cambios en `profile` y `progress`.
   - Controla el estado (`idle`, `syncing`, `synced`, `error`, `unauthenticated`).
   - Implementa un debounce de 1 segundo y evita envíos duplicados de los mismos datos.
   - Provee una función manual `forceSync()` y `loginAndSync()`.

2. **Actualización de `src/utils/googleSheets.ts`**:
   - Nueva función `upsertApprenticeProgress(accessToken, spreadsheetId, profile, progress)`:
     - Lee la columna de documentos de identidad (`D:D`).
     - Si encuentra el documento del aprendiz, actualiza (`PUT`) su fila correspondiente (`A{row}:P{row}`).
     - Si es un aprendiz nuevo, añade (`POST /append`) la fila al final.
   - Mantenimiento del token activo y manejo de errores silenciosos sin interrumpir la aplicación.

3. **Nuevo componente `src/components/SyncCloudStatus.tsx`**:
   - Indicador visual compacto para la barra superior (`Navbar.tsx`).
   - Muestra el estado actual con tooltip detallado (hora del último guardado, enlace directo a abrir la hoja en Drive).

4. **Integración en `App.tsx`**:
   - Conexión del hook a nivel raíz para que todos los eventos de progreso (`handleCompleteModule`, `handleSolveScenario`, `handlePassExam`, `onSaveProfile`) se sincronicen de manera automática y desatendida.
