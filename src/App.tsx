/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InductionRoadmap } from './components/InductionRoadmap';
import { ModuleViewer } from './components/ModuleViewer';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { FinalEvaluation } from './components/FinalEvaluation';
import { CertificateView } from './components/CertificateView';
import { ProfileEditModal } from './components/ProfileEditModal';
import { RegulationSearchModal } from './components/RegulationSearchModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { ApprenticeProfile, UserInductionProgress, AppRole } from './types';
import { useAutoGoogleSheetsSync } from './hooks/useAutoGoogleSheetsSync';
import { InstructorDashboard } from './components/InstructorDashboard';
import { RoleSwitchModal } from './components/RoleSwitchModal';
import { LandingPage } from './components/LandingPage';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredProgress,
  saveStoredProgress,
  getStoredTheme,
  saveStoredTheme,
  getStoredRole,
  saveStoredRole,
  playSound,
  saveOrUpdateApprenticeRecord,
  createInitialProgress,
} from './utils/storage';

import { INDUCTION_MODULES } from './data/regulationData';
import { RotateCcw, BookOpen, Shield, Award, LogOut } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<ApprenticeProfile>(getStoredProfile);
  const [progress, setProgress] = useState<UserInductionProgress>(getStoredProgress);
  const [theme, setTheme] = useState<'light' | 'dark'>(getStoredTheme);
  const [role, setRole] = useState<AppRole>(getStoredRole);
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('portal') === 'landing') return false;
      return sessionStorage.getItem('sena_session_active_v1') === 'true';
    }
    return false;
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isScreenBlurActive, setIsScreenBlurActive] = useState(false);
  const [currentTab, setCurrentTab] = useState<'roadmap' | 'modules' | 'simulator' | 'exam' | 'certificate' | 'instructor'>(() => {
    return getStoredRole() === 'instructor' ? 'instructor' : 'roadmap';
  });
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-1');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoogleSyncOpen, setIsGoogleSyncOpen] = useState(false);


  // Auto-sync continuous background hook for Google Sheets & Drive
  const cloudSync = useAutoGoogleSheetsSync({
    profile,
    progress,
    enabled: true,
    debounceMs: 1200,
  });


  // Sync theme class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    playSound('click');
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Trigger screen blur transition
    setIsScreenBlurActive(true);
    setTheme(nextTheme);

    setTimeout(() => {
      setIsScreenBlurActive(false);
    }, 700);
  };

  // Sync to localStorage
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredProgress(progress);
  }, [progress]);

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentTab('modules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteModule = (moduleId: string, xpGained: number, badgeId: string) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedModules.includes(moduleId);
      const newCompleted = alreadyCompleted ? prev.completedModules : [...prev.completedModules, moduleId];
      const newBadges = prev.badges.includes(badgeId) ? prev.badges : [...prev.badges, badgeId];
      const newXp = alreadyCompleted ? prev.totalXp : prev.totalXp + xpGained;

      return {
        ...prev,
        completedModules: newCompleted,
        badges: newBadges,
        totalXp: newXp,
      };
    });
  };

  const handleSolveScenario = (scenarioId: string, xpGained: number) => {
    setProgress((prev) => {
      const already = prev.completedScenarios.includes(scenarioId);
      const newCompleted = already ? prev.completedScenarios : [...prev.completedScenarios, scenarioId];
      let newBadges = [...prev.badges];

      // Award badge if 3 scenarios resolved
      if (newCompleted.length >= 3 && !newBadges.includes('badge-casos-reales')) {
        newBadges.push('badge-casos-reales');
      }

      return {
        ...prev,
        completedScenarios: newCompleted,
        badges: newBadges,
        totalXp: prev.totalXp + xpGained,
      };
    });
  };

  const handlePassExam = (score: number, certCode: string) => {
    const today = new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    setProgress((prev) => {
      const newBadges = prev.badges.includes('badge-graduado-induccion')
        ? prev.badges
        : [...prev.badges, 'badge-graduado-induccion'];

      return {
        ...prev,
        isCertified: true,
        finalExamScore: score,
        certificateCode: certCode,
        certifiedDate: today,
        badges: newBadges,
        totalXp: prev.totalXp + 500,
      };
    });

    // Automatically navigate to certificate view
    setTimeout(() => {
      setCurrentTab('certificate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar tu progreso de inducción para realizarla nuevamente?')) {
      const resetState: UserInductionProgress = createInitialProgress();
      setProgress(resetState);
      saveStoredProgress(resetState);
      saveOrUpdateApprenticeRecord(profile, resetState);
      setCurrentTab('roadmap');
      playSound('click');
    }
  };

  const handleEnterAsLearner = (
    updatedProfile: ApprenticeProfile,
    customProgress?: UserInductionProgress
  ) => {
    // Si se pasa progreso (registro previo recuperado o inicio limpio en cero), se aplica
    const finalProgress = customProgress || getStoredProgress();

    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);

    setProgress(finalProgress);
    saveStoredProgress(finalProgress);

    saveOrUpdateApprenticeRecord(updatedProfile, finalProgress);

    setRole('aprendiz');
    saveStoredRole('aprendiz');
    setCurrentTab('roadmap');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sena_session_active_v1', 'true');
    }
    setHasEntered(true);
    playSound('levelup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleEnterAsInstructor = () => {
    setRole('instructor');
    saveStoredRole('instructor');
    setCurrentTab('instructor');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sena_session_active_v1', 'true');
    }
    setHasEntered(true);
    playSound('levelup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitToLanding = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sena_session_active_v1');
    }
    setHasEntered(false);
    playSound('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Landing Page as gateway until user selects role & submits credentials/characterization
  if (!hasEntered) {
    return (
      <LandingPage
        currentProfile={profile}
        initialRole={role}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onEnterAsLearner={handleEnterAsLearner}
        onEnterAsInstructor={handleEnterAsInstructor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Screen Blur Overlay when applying theme */}
      {isScreenBlurActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 animate-screen-blur bg-slate-950/20 dark:bg-black/30 backdrop-blur-md"
        />
      )}

      {/* 3-zone Header with Theme Switcher & Auto Cloud Sync */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          playSound('click');
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        progress={progress}
        theme={theme}
        role={role}
        cloudSync={cloudSync}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGoogleSync={() => setIsGoogleSyncOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onExitToLanding={handleExitToLanding}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Pantalla Exclusiva del Instructor */}
        {currentTab === 'instructor' && (
          <InstructorDashboard
            currentProfile={profile}
            currentProgress={progress}
            cloudSync={cloudSync}
            onSwitchToLearnerView={() => {
              setRole('aprendiz');
              saveStoredRole('aprendiz');
              setCurrentTab('roadmap');
            }}
            onOpenGoogleSyncModal={() => setIsGoogleSyncOpen(true)}
          />
        )}

        {currentTab === 'roadmap' && (
          <InductionRoadmap
            profile={profile}
            progress={progress}
            onSelectModule={handleSelectModule}
            onGoToSimulator={() => {
              setCurrentTab('simulator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToExam={() => {
              setCurrentTab('exam');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToCertificate={() => {
              setCurrentTab('certificate');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGoogleSync={role === 'instructor' ? () => setIsGoogleSyncOpen(true) : undefined}
          />
        )}


        {currentTab === 'modules' && (
          <ModuleViewer
            moduleId={selectedModuleId}
            progress={progress}
            onBackToRoadmap={() => setCurrentTab('roadmap')}
            onCompleteModule={handleCompleteModule}
            onSelectNextModule={(nextId) => {
              setSelectedModuleId(nextId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'simulator' && (
          <ScenarioSimulator
            progress={progress}
            onSolveScenario={handleSolveScenario}
            onGoToRoadmap={() => setCurrentTab('roadmap')}
          />
        )}

        {currentTab === 'exam' && (
          <FinalEvaluation
            progress={progress}
            onPassExam={handlePassExam}
            onGoToCertificate={() => setCurrentTab('certificate')}
          />
        )}

        {currentTab === 'certificate' && (
          <CertificateView
            profile={profile}
            progress={progress}
            onOpenEditProfile={() => setIsProfileModalOpen(true)}
            onGoBackToRoadmap={() => setCurrentTab('roadmap')}
            onOpenGoogleSync={role === 'instructor' ? () => setIsGoogleSyncOpen(true) : undefined}
          />
        )}
      </main>

      {/* Regulation Search Modal */}
      <RegulationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectModule={handleSelectModule}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
        onOpenGoogleSync={
          role === 'instructor'
            ? () => {
                setIsProfileModalOpen(false);
                setIsGoogleSyncOpen(true);
              }
            : undefined
        }
      />

      {/* Google Drive & Sheets Sync Modal (Exclusivo Instructor) */}
      <GoogleDriveSyncModal
        isOpen={isGoogleSyncOpen}
        onClose={() => setIsGoogleSyncOpen(false)}
        profile={profile}
        progress={progress}
      />

      {/* Role Switcher Modal (Protegido por Clave para Instructor) */}
      <RoleSwitchModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={role}
        onSelectRole={(newRole) => {
          setRole(newRole);
          saveStoredRole(newRole);
          if (newRole === 'instructor') {
            setCurrentTab('instructor');
          } else {
            if (currentTab === 'instructor') {
              setCurrentTab('roadmap');
            }
          }
        }}
      />

      {/* Clean Institutional Footer */}
      <footer className="no-print bg-white dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 mt-auto py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#39A900] text-white flex items-center justify-center font-bold text-[10px]">
                S
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Servicio Nacional de Aprendizaje · SENA
              </span>
              <span>·</span>
              <span>Reglamento del Aprendiz (Acuerdo 009 de 2024)</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleExitToLanding}
                className="text-slate-600 dark:text-slate-300 hover:text-[#39A900] dark:hover:text-[#39A900] transition-colors flex items-center gap-1.5 font-semibold"
                title="Cambiar entre perfil de Aprendiz e Instructor en la Portada"
              >
                <Shield className="w-3.5 h-3.5 text-[#39A900]" />
                <span>Rol: {role === 'instructor' ? 'Instructor (Cambiar / Salir)' : 'Aprendiz (Cambiar / Salir)'}</span>
              </button>
              <span>·</span>
              <span>Formación Profesional Integral</span>
              {role === 'instructor' && (
                <>
                  <span>·</span>
                  <button
                    onClick={handleResetProgress}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
                    title="Reiniciar progreso para pruebas"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reiniciar inducción</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

