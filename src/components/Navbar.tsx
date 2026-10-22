import { ShieldCheck, Search, UserCheck, Award, Sparkles, Moon, Sun, FileSpreadsheet, Shield, User, LogOut } from 'lucide-react';
import { ApprenticeProfile, UserInductionProgress, AppRole } from '../types';
import { SyncCloudStatus } from './SyncCloudStatus';
import { UseAutoGoogleSheetsSyncReturn } from '../hooks/useAutoGoogleSheetsSync';

const SENA_LOGO_DATA_URI = "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e";

interface NavbarProps {
  currentTab: 'roadmap' | 'modules' | 'simulator' | 'exam' | 'certificate' | 'instructor';
  setCurrentTab: (tab: 'roadmap' | 'modules' | 'simulator' | 'exam' | 'certificate' | 'instructor') => void;
  profile: ApprenticeProfile;
  progress: UserInductionProgress;
  theme: 'light' | 'dark';
  role: AppRole;
  cloudSync: UseAutoGoogleSheetsSyncReturn;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenGoogleSync: () => void;
  onOpenRoleModal: () => void;
  onExitToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  progress,
  theme,
  role,
  cloudSync,
  onToggleTheme,
  onOpenSearch,
  onOpenProfile,
  onOpenGoogleSync,
  onOpenRoleModal,
  onExitToLanding,
}) => {
  // Calculate level based on XP
  const level = Math.floor(progress.totalXp / 250) + 1;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 sm:gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setCurrentTab('roadmap')}
            className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] rounded-lg p-1 transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
          >
            <img
              src={SENA_LOGO_DATA_URI}
              alt="Logo Oficial SENA"
              className="w-12 h-12 object-contain shrink-0"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              Inducción SENA 2025
            </span>
          </button>

          {/* Zone 2: Navigation Links differentiated by Role */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            {role === 'instructor' && (
              <button
                onClick={() => setCurrentTab('instructor')}
                className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'instructor'
                    ? 'border-[#39A900] text-slate-900 dark:text-white font-bold'
                    : 'border-transparent text-blue-600 dark:text-blue-400 font-semibold'
                }`}
              >
                <Shield className="w-4 h-4 text-[#39A900]" />
                <span>Panel Instructor</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('roadmap')}
              className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'roadmap'
                  ? 'border-[#39A900] text-slate-900 dark:text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Ruta de Inducción
            </button>
            <button
              onClick={() => setCurrentTab('modules')}
              className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'modules'
                  ? 'border-[#39A900] text-slate-900 dark:text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Reglamento 2024
            </button>
            <button
              onClick={() => setCurrentTab('simulator')}
              className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'simulator'
                  ? 'border-[#39A900] text-slate-900 dark:text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Simulador de Casos
            </button>
            <button
              onClick={() => setCurrentTab(progress.isCertified ? 'certificate' : 'exam')}
              className={`hover:text-[#39A900] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'exam' || currentTab === 'certificate'
                  ? 'border-[#39A900] text-slate-900 dark:text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              {progress.isCertified ? 'Mi Certificado' : 'Evaluación Final'}
            </button>
          </nav>

          {/* Zone 3: 1 primary action / Profile status trigger + Dark Mode Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Solo el instructor tiene acceso al control de sincronización de Google Sheets */}
            {role === 'instructor' ? (
              <SyncCloudStatus
                syncState={cloudSync.syncState}
                lastSyncedAt={cloudSync.lastSyncedAt}
                spreadsheetUrl={cloudSync.spreadsheetUrl}
                userEmail={cloudSync.userEmail}
                errorMessage={cloudSync.errorMessage}
                onConnect={cloudSync.connectGoogleAccount}
                onForceSync={cloudSync.forceSync}
                onOpenDetailsModal={onOpenGoogleSync}
              />
            ) : null}

            {/* Selector / Indicador de Rol */}
            <button
              onClick={onExitToLanding || onOpenRoleModal}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] ${
                role === 'instructor'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={role === 'instructor' ? 'Perfil Instructor (Clic para cambiar de rol o salir a portada)' : 'Perfil Aprendiz (Clic para cambiar de rol o salir)'}
            >
              {role === 'instructor' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="hidden sm:inline">Instructor</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Aprendiz</span>
                </>
              )}
            </button>

            {onExitToLanding && (
              <button
                onClick={onExitToLanding}
                className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900]"
                title="Cambiar Rol / Salir a Portada"
                aria-label="Volver a la portada de selección de rol"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900]"
              title="Buscar en el reglamento (Acuerdo 009 de 2024)"
              aria-label="Buscar artículo en el reglamento"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle Button (Top Right) */}
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900]"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Learner Profile Pill */}
            <button
              onClick={onOpenProfile}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Editar datos de ficha"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#39A900]" />
              <span className="max-w-[120px] truncate">{profile.fullName.split(' ')[0]}</span>
              <span className="font-mono text-[11px] text-[#00324D] dark:text-emerald-400 font-semibold">Nv.{level} ({progress.totalXp} XP)</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setCurrentTab(progress.isCertified ? 'certificate' : 'exam')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                progress.isCertified
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                  : 'bg-[#39A900] hover:bg-[#329200] text-white'
              }`}
            >
              {progress.isCertified ? (
                <>
                  <Award className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ver Certificado</span>
                  <span className="sm:hidden">Certificado</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Certificarme</span>
                  <span className="sm:hidden">Examen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile secondary bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs font-medium text-slate-600 dark:text-slate-300 gap-4">
          {role === 'instructor' && (
            <button
              onClick={() => setCurrentTab('instructor')}
              className={`whitespace-nowrap font-bold text-blue-600 dark:text-blue-400 ${currentTab === 'instructor' ? 'underline' : ''}`}
            >
              Instructor
            </button>
          )}
          <button
            onClick={() => setCurrentTab('roadmap')}
            className={`whitespace-nowrap ${currentTab === 'roadmap' ? 'text-[#39A900] font-semibold' : ''}`}
          >
            Ruta
          </button>
          <button
            onClick={() => setCurrentTab('modules')}
            className={`whitespace-nowrap ${currentTab === 'modules' ? 'text-[#39A900] font-semibold' : ''}`}
          >
            Reglamento
          </button>
          <button
            onClick={() => setCurrentTab('simulator')}
            className={`whitespace-nowrap ${currentTab === 'simulator' ? 'text-[#39A900] font-semibold' : ''}`}
          >
            Simulador
          </button>
          <button
            onClick={() => setCurrentTab(progress.isCertified ? 'certificate' : 'exam')}
            className={`whitespace-nowrap ${currentTab === 'exam' || currentTab === 'certificate' ? 'text-[#39A900] font-semibold' : ''}`}
          >
            {progress.isCertified ? 'Certificado' : 'Evaluación'}
          </button>
          <button
            onClick={onOpenProfile}
            className="whitespace-nowrap text-slate-500 dark:text-slate-400"
          >
            Mi Ficha
          </button>
          {role === 'instructor' ? (
            <button
              onClick={onOpenGoogleSync}
              className="whitespace-nowrap text-[#39A900] dark:text-emerald-400 flex items-center gap-1 font-medium"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Drive</span>
            </button>
          ) : (
            <button
              onClick={onOpenRoleModal}
              className="whitespace-nowrap text-slate-500 dark:text-slate-400 flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-slate-400" />
              <span>Instructor</span>
            </button>
          )}

          {onExitToLanding && (
            <button
              onClick={onExitToLanding}
              className="whitespace-nowrap text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3 h-3" />
              <span>Salir</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
