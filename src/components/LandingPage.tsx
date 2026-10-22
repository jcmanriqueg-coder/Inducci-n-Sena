/**
 * @file src/components/LandingPage.tsx
 * Portal de Entrada Institucional SENA con Selección de Rol (Aprendiz vs Instructor)
 * - Aprendiz: Registro de datos de caracterización SIN CLAVE para inicio inmediato
 * - Instructor: Acceso protegido mediante clave institucional "Sena1234"
 */

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  KeyRound,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Building2,
  FileText,
  Mail,
  Fingerprint,
  FolderSync,
  RotateCcw,
} from 'lucide-react';
import { ApprenticeProfile, AppRole, UserInductionProgress } from '../types';
import {

  findApprenticeRecord,
  createInitialProgress,
  saveOrUpdateApprenticeRecord,
} from '../utils/storage';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';


const SENA_LOGO_DATA_URI = "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e";

const POPULAR_REGIONALS = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle',
  'Regional Santander',
  'Regional Atlántico',
  'Regional Bolívar',
  'Regional Caldas',
  'Regional Risaralda',
  'Regional Cundinamarca',
  'Regional Boyacá',
  'Regional Tolima',
  'Regional Huila',
  'Regional Nariño',
  'Regional Cauca',
  'Regional Meta',
  'Regional Norte de Santander',
  'Regional Córdoba',
  'Regional Cesar',
  'Regional Magdalena',
  'Regional Quindío',
];

interface LandingPageProps {
  currentProfile: ApprenticeProfile;
  initialRole?: AppRole;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onEnterAsLearner: (profile: ApprenticeProfile, progress?: UserInductionProgress) => void;
  onEnterAsInstructor: () => void;
}


export const LandingPage: React.FC<LandingPageProps> = ({
  currentProfile,
  initialRole = 'aprendiz',
  theme,
  onToggleTheme,
  onEnterAsLearner,
  onEnterAsInstructor,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'aprendiz' | 'instructor'>(() => {

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('rol') || params.get('role');
      if (urlRole === 'instructor') return 'instructor';
      if (urlRole === 'aprendiz') return 'aprendiz';
    }
    return initialRole;
  });

  // Aprendiz Characterization State (No password)
  const [formData, setFormData] = useState<ApprenticeProfile>({
    fullName: currentProfile.fullName || '',
    documentType: currentProfile.documentType || 'CC',
    documentNumber: currentProfile.documentNumber || '',
    email: currentProfile.email || '',
    regional: currentProfile.regional || 'Regional Distrito Capital',
    centroFormacion:
      currentProfile.centroFormacion ||
      'Centro de Gestión de Mercados, Logística y Tecnologías de la Información',
    programaFormacion:
      currentProfile.programaFormacion || 'Análisis y Desarrollo de Software (ADSO)',
    numeroFicha: currentProfile.numeroFicha || '2879410',
    fechaIngreso:
      currentProfile.fechaIngreso ||
      new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(new Date()),
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Instructor Password State
  const [instructorPin, setInstructorPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);

  // Check if this document number already has an induction record in storage
  const existingStudentRecord = useMemo(() => {
    return findApprenticeRecord(formData.documentType, formData.documentNumber);
  }, [formData.documentType, formData.documentNumber]);

  // Handle auto-populating saved apprentice profile data if found
  const handleLoadSavedProfileData = () => {
    if (existingStudentRecord) {
      setFormData((prev) => ({
        ...existingStudentRecord.profile,
        documentType: prev.documentType,
        documentNumber: prev.documentNumber,
      }));
    }
  };

  // Handle Apprentice Form Submit
  const handleLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Por favor ingresa tu nombre completo';
    }
    if (!formData.documentNumber.trim()) {
      errors.documentNumber = 'Por favor ingresa tu número de documento';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    if (!formData.numeroFicha.trim()) {
      errors.numeroFicha = 'Ingresa el número de tu ficha de caracterización';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Multi-apprentice persistence:
    // If apprentice is already registered, resume their progress where they left off.
    // If it is a new apprentice, start completely from zero!
    const existing = findApprenticeRecord(formData.documentType, formData.documentNumber);
    const resolvedProgress: UserInductionProgress = existing
      ? { ...existing.progress }
      : createInitialProgress();

    saveOrUpdateApprenticeRecord(formData, resolvedProgress);
    onEnterAsLearner(formData, resolvedProgress);
  };


  // Handle Instructor Password Submit
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedPin = instructorPin.trim().toLowerCase();

    // Required clave: Sena1234
    if (sanitizedPin === 'sena1234') {
      setInstructorError(null);
      onEnterAsInstructor();
    } else {
      setInstructorError('Clave de acceso incorrecta. La clave autorizada para instructores es Sena1234.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Institutional Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={SENA_LOGO_DATA_URI}
              alt="Logo Oficial SENA"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                {t('app.title')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('app.subtitle')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle variant="compact" />
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}
              className="p-2 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all cursor-pointer"
              title={theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#39A900]" />
            <span>{t('landing.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('landing.hero_title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('landing.hero_desc')}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('aprendiz')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'aprendiz'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  activeTab === 'aprendiz'
                    ? 'bg-[#39A900] text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-none">{t('landing.tab_learner')}</span>
                <span className="text-[10px] font-normal opacity-80">{t('landing.tab_learner_sub')}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('instructor')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'instructor'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  activeTab === 'instructor'
                    ? 'bg-[#00324D] text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block leading-none">{t('landing.tab_instructor')}</span>
                <span className="text-[10px] font-normal opacity-80">{t('landing.tab_instructor_sub')}</span>
              </div>
            </button>
          </div>
        </div>


        {/* CONTAINER: APRENDIZ CARD & FORM */}
        {activeTab === 'aprendiz' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-[#39A900] p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{t('landing.learner_banner_tag')}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {t('landing.learner_banner_title')}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                    {t('landing.learner_banner_desc')}
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-center shrink-0">
                  <Award className="w-6 h-6 text-amber-300 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                    {t('landing.cert_title')}
                  </span>
                  <span className="text-xs font-extrabold text-white">{t('landing.cert_official')}</span>
                </div>
              </div>
            </div>

            {/* Characterization Form */}
            <form onSubmit={handleLearnerSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Nombre Completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_fullname')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t('landing.field_fullname_ph')}
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                      }}
                      className={`w-full px-4 py-2.5 pl-10 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900] ${
                        formErrors.fullName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_doctype')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documentType: e.target.value as 'CC' | 'TI' | 'CE' | 'PPT',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                  </select>
                </div>

                {/* Número de Documento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_docnumber')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t('landing.field_docnumber_ph')}
                      value={formData.documentNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, documentNumber: e.target.value });
                        if (formErrors.documentNumber)
                          setFormErrors({ ...formErrors, documentNumber: '' });
                      }}
                      className={`w-full px-4 py-2.5 pl-10 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900] ${
                        formErrors.documentNumber
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  {formErrors.documentNumber && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.documentNumber}
                    </p>
                  )}

                  {/* Real-time apprentice status indicator */}
                  {formData.documentNumber.trim().length >= 4 && (
                    <div className="mt-2 animate-in fade-in duration-150">
                      {existingStudentRecord ? (
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-blue-950 dark:text-blue-100 block">
                                  {t('landing.indicator_found_title')}
                                </span>
                                <span className="text-[11px] text-blue-800 dark:text-blue-300">
                                  {t('landing.indicator_found_desc', {
                                    completed: existingStudentRecord.progress.completedModules.length,
                                    xp: existingStudentRecord.progress.totalXp,
                                  })}
                                </span>
                              </div>
                            </div>
                            {existingStudentRecord.profile.fullName && formData.fullName !== existingStudentRecord.profile.fullName && (
                              <button
                                type="button"
                                onClick={handleLoadSavedProfileData}
                                className="text-[10px] font-bold text-[#00324D] dark:text-blue-300 bg-blue-100 dark:bg-blue-900/80 px-2 py-0.5 rounded hover:bg-blue-200 transition-colors shrink-0"
                                title="Autocompletar nombre, correo y ficha guardados"
                              >
                                {t('landing.btn_load_saved')}
                              </button>
                            )}
                          </div>
                          {existingStudentRecord.progress.isCertified && (
                            <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              <Award className="w-3 h-3 text-emerald-600" />
                              <span>{t('landing.indicator_cert_issued', { code: existingStudentRecord.progress.certificateCode || '' })}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                          <span>
                            {t('landing.indicator_new')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>



                {/* Correo Electrónico */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_email')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder={t('landing.field_email_ph')}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full px-4 py-2.5 pl-10 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900] ${
                        formErrors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  {formErrors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Regional SENA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_regional')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    list="regionals-list"
                    type="text"
                    required
                    placeholder={t('landing.field_regional_ph')}
                    value={formData.regional}
                    onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                  <datalist id="regionals-list">
                    {POPULAR_REGIONALS.map((reg) => (
                      <option key={reg} value={reg} />
                    ))}
                  </datalist>
                </div>

                {/* Número de Ficha */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_ficha')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t('landing.field_ficha_ph')}
                      value={formData.numeroFicha}
                      onChange={(e) => {
                        setFormData({ ...formData, numeroFicha: e.target.value });
                        if (formErrors.numeroFicha) setFormErrors({ ...formErrors, numeroFicha: '' });
                      }}
                      className={`w-full px-4 py-2.5 pl-10 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900] ${
                        formErrors.numeroFicha
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  {formErrors.numeroFicha && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.numeroFicha}
                    </p>
                  )}
                </div>

                {/* Centro de Formación */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_center')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('landing.field_center_ph')}
                      value={formData.centroFormacion}
                      onChange={(e) => setFormData({ ...formData, centroFormacion: e.target.value })}
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Programa de Formación */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('landing.field_program')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('landing.field_program_ph')}
                      value={formData.programaFormacion}
                      onChange={(e) =>
                        setFormData({ ...formData, programaFormacion: e.target.value })
                      }
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div
                className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
                  existingStudentRecord
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/60 text-blue-900 dark:text-blue-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                {existingStudentRecord ? (
                  <CheckCircle2 className="w-5 h-5 text-[#39A900] shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#39A900] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {existingStudentRecord
                      ? t('landing.notice_recovered_title')
                      : t('landing.notice_new_title')}
                  </span>
                  <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {existingStudentRecord
                      ? t('landing.notice_recovered_desc', {
                          name: formData.fullName || 'aprendiz',
                          completed: existingStudentRecord.progress.completedModules.length,
                          xp: existingStudentRecord.progress.totalXp,
                        })
                      : t('landing.notice_new_desc')}
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#39A900] hover:bg-[#329200] active:scale-[0.99] text-white font-bold text-base transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {existingStudentRecord ? (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    <span>
                      {t('landing.btn_continue', {
                        completed: existingStudentRecord.progress.completedModules.length,
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t('landing.btn_start_scratch')}</span>
                  </>
                )}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        )}


        {/* CONTAINER: INSTRUCTOR CARD & PASSWORD FORM */}
        {activeTab === 'instructor' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-slate-900 via-[#00324D] to-slate-800 p-6 sm:p-8 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold backdrop-blur-xs border border-blue-400/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
                    <span>{t('landing.instructor_tag')}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {t('landing.instructor_banner_title')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                    {t('landing.instructor_banner_desc')}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  <KeyRound className="w-7 h-7 text-[#39A900]" />
                </div>
              </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleInstructorSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('landing.instructor_pin_label')} <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#39A900] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {t('landing.instructor_pin_hint')}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t('landing.instructor_pin_ph')}
                    value={instructorPin}
                    onChange={(e) => {
                      setInstructorPin(e.target.value);
                      if (instructorError) setInstructorError(null);
                    }}
                    className={`w-full px-4 py-3 pl-11 pr-11 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#00324D] dark:focus:ring-[#39A900] font-mono ${
                      instructorError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-4 top-3.5 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {instructorError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{instructorError}</span>
                  </div>
                )}
              </div>

              {/* Privileges List */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  {t('landing.instructor_privileges_title')}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                    <span>{t('landing.privilege_1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                    <span>{t('landing.privilege_2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                    <span>{t('landing.privilege_3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                    <span>{t('landing.privilege_4')}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#00324D] hover:bg-[#002538] active:scale-[0.99] text-white font-bold text-base transition-all shadow-lg hover:shadow-blue-900/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-[#39A900]" />
                <span>{t('landing.btn_enter_instructor')}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        )}

        {/* Informative Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#39A900] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                {t('landing.feat_1_title')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feat_1_desc')}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                {t('landing.feat_2_title')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feat_2_desc')}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                {t('landing.feat_3_title')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('landing.feat_3_desc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#39A900] text-white flex items-center justify-center font-bold text-[9px]">
              S
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t('footer.sena')}
            </span>
            <span>·</span>
            <span>{t('footer.country')}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {t('footer.agreement')}
          </div>
        </div>
      </footer>
    </div>
  );
};

