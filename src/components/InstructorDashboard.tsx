/**
 * @file src/components/InstructorDashboard.tsx
 * Pantalla y portal exclusivo del Instructor para:
 * 1. Monitoreo y seguimiento en tiempo real del progreso de todos los aprendices.
 * 2. Gestión y configuración de la hoja de cálculo en Google Drive.
 * 3. Generación y copia del enlace directo para compartir con los aprendices.
 * 4. Métricas consolidadas de inducción (módulos, exámenes, certificaciones).
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Award,
  FileSpreadsheet,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  Filter,
  Download,
  AlertCircle,
  HelpCircle,
  Mail,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { ApprenticeProfile, UserInductionProgress, InstructorApprenticeRecord } from '../types';
import { UseAutoGoogleSheetsSyncReturn } from '../hooks/useAutoGoogleSheetsSync';
import { fetchApprenticesFromSheet, getGoogleAccessToken } from '../utils/googleSheets';
import { getAllApprenticeRecords } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';


interface InstructorDashboardProps {
  currentProfile: ApprenticeProfile;
  currentProgress: UserInductionProgress;
  cloudSync: UseAutoGoogleSheetsSyncReturn;
  onSwitchToLearnerView: () => void;
  onOpenGoogleSyncModal: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentProfile,
  currentProgress,
  cloudSync,
  onSwitchToLearnerView,
  onOpenGoogleSyncModal,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'monitoring' | 'config' | 'sharing'>('monitoring');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'certified' | 'in_progress'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [sheetLearners, setSheetLearners] = useState<InstructorApprenticeRecord[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<InstructorApprenticeRecord | null>(null);

  // Generate clean apprentice shareable link
  const apprenticeLink = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('rol', 'aprendiz');
    return url.toString();
  }, []);

  // Invitation template for instructors to send to students
  const inviteMessage = useMemo(() => {
    if (language === 'en') {
      return `*OFFICIAL SENA INDUCTION 2025*\nDear apprentices, here is the official link to complete the Apprentice Regulations Induction (Agreement 009 of 2024):\n\n🔗 *Link:* ${apprenticeLink}\n\n*Instructions:*\n1. Access the link and fill out your cohort profile in 'My Profile'.\n2. Complete all 6 interactive modules and resolve the simulator cases.\n3. Take the final evaluation and download your official certificate.\n\nYour progress is tracked automatically in the background. Best wishes in your vocational training!`;
    }
    return `*INDUCCIÓN OFICIAL SENA 2025*\nEstimados aprendices, les comparto el enlace oficial para realizar la inducción del Reglamento del Aprendiz (Acuerdo 009 de 2024):\n\n🔗 *Enlace:* ${apprenticeLink}\n\n*Instrucciones:*\n1. Ingresen y completen sus datos en 'Mi Ficha'.\n2. Realicen los 6 módulos interactivos y resuelvan los casos del simulador.\n3. Presenten la evaluación final y descarguen su certificado oficial.\n\nSu avance se registrará de forma automática. ¡Muchos éxitos en su formación profesional!`;
  }, [apprenticeLink, language]);

  // Load learners from Google Sheets if connected, or fallback to current student session
  const loadLearnersFromSheet = async () => {
    const token = getGoogleAccessToken();
    const sheetUrl = cloudSync.spreadsheetUrl;
    if (!token || !sheetUrl) {
      return;
    }

    // Extract spreadsheetId from URL or cache
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const spreadsheetId = match ? match[1] : '';

    if (!spreadsheetId) return;

    setIsLoadingSheet(true);
    try {
      const records = await fetchApprenticesFromSheet(token, spreadsheetId);
      setSheetLearners(records);
    } catch (err) {
      console.warn('No se pudieron consultar registros desde Google Sheets:', err);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  useEffect(() => {
    if (cloudSync.syncState === 'synced' || cloudSync.spreadsheetUrl) {
      loadLearnersFromSheet();
    }
  }, [cloudSync.syncState, cloudSync.spreadsheetUrl]);

  // Build unified list of learners: sheet learners or all locally registered apprentices
  const learnersList: InstructorApprenticeRecord[] = useMemo(() => {
    if (sheetLearners.length > 0) {
      return sheetLearners;
    }

    const localRecords = getAllApprenticeRecords();
    if (localRecords.length > 0) {
      return localRecords.map((r) => {
        const d = r.updatedAt ? new Date(r.updatedAt) : new Date();
        const dateStr = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
        const isCert = r.progress.isCertified;

        return {
          timestamp: dateStr,
          fullName: r.profile.fullName || 'Aprendiz SENA',
          documentType: r.profile.documentType || 'CC',
          documentNumber: r.profile.documentNumber || 'N/A',
          email: r.profile.email || 'Sin correo',
          programaFormacion: r.profile.programaFormacion || 'N/A',
          numeroFicha: r.profile.numeroFicha || 'N/A',
          regional: r.profile.regional || 'N/A',
          centroFormacion: r.profile.centroFormacion || 'N/A',
          finalExamScore:
            r.progress.finalExamScore !== undefined ? `${r.progress.finalExamScore}%` : 'Pendiente',
          completedModules: `${r.progress.completedModules.length} de 6`,
          completedScenarios: `${r.progress.completedScenarios.length} de 4`,
          totalXp: `${r.progress.totalXp} XP`,
          status: isCert ? 'CERTIFICADO (Aprobado)' : 'En Formación',
          certificateCode: r.progress.certificateCode || 'Pendiente',
          certifiedDate: r.progress.certifiedDate || 'Pendiente',
        };
      });
    }

    // Fallback representation of current active learner
    const today = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
    return [
      {
        timestamp: today,
        fullName: currentProfile.fullName,
        documentType: currentProfile.documentType,
        documentNumber: currentProfile.documentNumber,
        email: currentProfile.email,
        programaFormacion: currentProfile.programaFormacion,
        numeroFicha: currentProfile.numeroFicha,
        regional: currentProfile.regional,
        centroFormacion: currentProfile.centroFormacion,
        finalExamScore: currentProgress.finalExamScore !== undefined ? `${currentProgress.finalExamScore}%` : 'Pendiente',
        completedModules: `${currentProgress.completedModules.length} de 6`,
        completedScenarios: `${currentProgress.completedScenarios.length} de 4`,
        totalXp: `${currentProgress.totalXp} XP`,
        status: currentProgress.isCertified ? 'CERTIFICADO (Aprobado)' : 'En Formación',
        certificateCode: currentProgress.certificateCode || 'Pendiente',
        certifiedDate: currentProgress.certifiedDate || 'Pendiente',
      },
    ];
  }, [sheetLearners, currentProfile, currentProgress]);


  // Filtered learners
  const filteredLearners = useMemo(() => {
    return learnersList.filter((l) => {
      const matchesSearch =
        l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.documentNumber.includes(searchTerm) ||
        l.numeroFicha.includes(searchTerm) ||
        l.regional.toLowerCase().includes(searchTerm.toLowerCase());

      const isCert = l.status.toLowerCase().includes('certificado');
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'certified' && isCert) ||
        (statusFilter === 'in_progress' && !isCert);

      return matchesSearch && matchesStatus;
    });
  }, [learnersList, searchTerm, statusFilter]);

  // Metrics
  const totalCount = learnersList.length;
  const certifiedCount = learnersList.filter((l) => l.status.toLowerCase().includes('certificado')).length;
  const certificationRate = totalCount > 0 ? Math.round((certifiedCount / totalCount) * 100) : 0;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apprenticeLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Nombres',
      'Tipo Doc',
      'Documento',
      'Correo',
      'Programa',
      'Ficha',
      'Regional',
      'Nota Examen',
      'Modulos',
      'Casos',
      'XP',
      'Estado',
      'Certificado',
    ];

    const rows = filteredLearners.map((l) => [
      `"${l.timestamp}"`,
      `"${l.fullName}"`,
      `"${l.documentType}"`,
      `"${l.documentNumber}"`,
      `"${l.email}"`,
      `"${l.programaFormacion}"`,
      `"${l.numeroFicha}"`,
      `"${l.regional}"`,
      `"${l.finalExamScore}"`,
      `"${l.completedModules}"`,
      `"${l.completedScenarios}"`,
      `"${l.totalXp}"`,
      `"${l.status}"`,
      `"${l.certificateCode}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Seguimiento_Induccion_SENA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Banner Principal del Instructor */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#00324D] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-700/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#39A900] text-white text-[11px] font-bold tracking-wider uppercase">
                {t('instructor.badge')}
              </span>
              <span className="text-xs text-slate-300">
                {t('instructor.center_title')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('instructor.main_title')}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {t('instructor.main_desc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#39A900]" /> : <Share2 className="w-4 h-4 text-[#39A900]" />}
              <span>{copiedLink ? t('instructor.copied_link_btn') : t('instructor.copy_link_btn')}</span>
            </button>

            <button
              onClick={onSwitchToLearnerView}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-600 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Abrir la plataforma tal como la ven los aprendices"
            >
              <Eye className="w-4 h-4 text-[#39A900]" />
              <span>{t('instructor.view_as_learner')}</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/80">
          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('instructor.metric_learners')}</span>
              <Users className="w-4 h-4 text-[#39A900]" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {totalCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t('instructor.metric_tracking')}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('instructor.metric_certified')}</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {certifiedCount}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">
              {t('instructor.metric_completion', { rate: certificationRate })}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('instructor.metric_sheets')}</span>
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-white truncate">
              {cloudSync.spreadsheetUrl ? t('instructor.metric_connected') : t('instructor.metric_pending')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {cloudSync.spreadsheetUrl ? t('instructor.metric_auto_active') : t('instructor.metric_needs_conn')}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t('instructor.metric_regulations')}</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-semibold text-white">
              {t('instructor.metric_reg_name')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {t('instructor.metric_modules_count')}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas del Instructor */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'monitoring'
              ? 'bg-[#39A900] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('instructor.tab_monitoring', { count: filteredLearners.length })}</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'config'
              ? 'bg-[#39A900] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t('instructor.tab_config')}</span>
        </button>

        <button
          onClick={() => setActiveTab('sharing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sharing'
              ? 'bg-[#39A900] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>{t('instructor.tab_sharing')}</span>
        </button>
      </div>

      {/* PESTAÑA 1: SEGUIMIENTO DE APRENDICES */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={t('instructor.search_ph')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t('instructor.filter_all')}
                </button>
                <button
                  onClick={() => setStatusFilter('certified')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    statusFilter === 'certified'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t('instructor.filter_certified')}
                </button>
                <button
                  onClick={() => setStatusFilter('in_progress')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    statusFilter === 'in_progress'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t('instructor.filter_in_progress')}
                </button>
              </div>

              <button
                onClick={loadLearnersFromSheet}
                disabled={isLoadingSheet}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Actualizar datos desde Google Sheets"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingSheet ? 'animate-spin text-[#39A900]' : ''}`} />
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                title="Descargar reporte en formato CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('instructor.export_csv')}</span>
              </button>
            </div>
          </div>

          {/* Tabla de Aprendices */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('instructor.th_apprentice')}</th>
                    <th className="py-3 px-4">{t('instructor.th_document')}</th>
                    <th className="py-3 px-4">{t('instructor.th_ficha')}</th>
                    <th className="py-3 px-4">{t('instructor.th_modules')}</th>
                    <th className="py-3 px-4">{t('instructor.th_cases')}</th>
                    <th className="py-3 px-4">{t('instructor.th_score')}</th>
                    <th className="py-3 px-4">{t('instructor.th_status')}</th>
                    <th className="py-3 px-4 text-right">{t('instructor.th_detail')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredLearners.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        {t('instructor.no_learners_found')}
                      </td>
                    </tr>
                  ) : (
                    filteredLearners.map((learner, idx) => {
                      const isCert = learner.status.toLowerCase().includes('certificado');
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {learner.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {learner.email || 'Sin correo'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <span className="text-[10px] text-slate-400 mr-1">{learner.documentType}</span>
                            {learner.documentNumber}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              Ficha {learner.numeroFicha || 'N/A'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {learner.programaFormacion}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              {learner.completedModules}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums text-slate-600 dark:text-slate-300">
                            {learner.completedScenarios}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono tabular-nums">
                            {learner.finalExamScore === 'Pendiente' ? (
                              <span className="text-slate-400 text-[11px]">{t('instructor.score_pending')}</span>
                            ) : (
                              <span
                                className={`font-bold ${
                                  parseInt(learner.finalExamScore) >= 80
                                    ? 'text-[#39A900] dark:text-emerald-400'
                                    : 'text-amber-600 dark:text-amber-400'
                                }`}
                              >
                                {learner.finalExamScore}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                isCert
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {isCert && <CheckCircle2 className="w-3 h-3 text-[#39A900]" />}
                              {isCert ? t('instructor.status_certified') : t('instructor.status_in_progress')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedLearner(learner)}
                              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium text-xs cursor-pointer"
                            >
                              {t('instructor.btn_view_file')}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pie de tabla con datos */}
            <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t('instructor.showing_count', { filtered: filteredLearners.length, total: learnersList.length })}</span>
              {cloudSync.spreadsheetUrl && (
                <a
                  href={cloudSync.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#39A900] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('instructor.open_in_sheets')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: CONFIGURACIÓN DE GOOGLE DRIVE & SHEETS */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#39A900]">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {t('instructor.config_drive_title')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('instructor.config_drive_desc')}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    cloudSync.spreadsheetUrl
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {cloudSync.spreadsheetUrl ? t('instructor.status_linked') : t('instructor.status_unlinked')}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('instructor.google_account')}
                  </label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span>{cloudSync.userEmail || t('instructor.no_account')}</span>
                    {!cloudSync.userEmail ? (
                      <button
                        onClick={cloudSync.connectGoogleAccount}
                        className="px-3 py-1 bg-[#39A900] hover:bg-[#329200] text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {t('instructor.login_google')}
                      </button>
                    ) : (
                      <button
                        onClick={cloudSync.disconnectGoogleAccount}
                        className="text-xs text-rose-500 hover:underline cursor-pointer"
                      >
                        {t('instructor.disconnect_google')}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('instructor.sheet_link')}
                  </label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <span className="truncate text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {cloudSync.spreadsheetUrl || t('instructor.no_sheet_yet')}
                    </span>
                    {cloudSync.spreadsheetUrl && (
                      <a
                        href={cloudSync.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center gap-1 px-3 py-1 bg-[#39A900] text-white rounded-md font-semibold text-xs whitespace-nowrap hover:bg-[#329600] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{t('instructor.open_in_drive')}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={onOpenGoogleSyncModal}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {t('instructor.open_sync_wizard')}
                  </button>
                  <button
                    onClick={cloudSync.forceSync}
                    disabled={cloudSync.syncState === 'syncing'}
                    className="px-4 py-2 bg-[#39A900] hover:bg-[#329600] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {cloudSync.syncState === 'syncing' ? t('instructor.syncing') : t('instructor.force_sync')}
                  </button>
                </div>
              </div>
            </div>

            {/* Estructura de Columnas */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                {t('instructor.drive_structure_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {t('instructor.drive_structure_desc')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {[
                  '1. Fecha de Registro',
                  '2. Nombres y Apellidos',
                  '3. Tipo Documento',
                  '4. Número de Documento',
                  '5. Correo Electrónico',
                  '6. Programa de Formación',
                  '7. Número de Ficha',
                  '8. Regional SENA',
                  '9. Centro de Formación',
                  '10. Nota Examen Final',
                  '11. Módulos Completados',
                  '12. Casos Resueltos',
                  '13. XP Acumulada',
                  '14. Estado Inducción',
                  '15. Código Certificado',
                  '16. Fecha Certificación',
                ].map((col, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {col}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Lateral: Privilegios del Instructor */}
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 p-5">
              <div className="flex items-center gap-2 text-[#39A900] dark:text-emerald-400 font-bold text-xs mb-2">
                <Shield className="w-4 h-4" />
                <span>{t('instructor.privileges_title')}</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-4">
                <li>{t('instructor.privilege_1')}</li>
                <li>{t('instructor.privilege_2')}</li>
                <li>{t('instructor.privilege_3')}</li>
                <li>{t('instructor.privilege_4')}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs text-slate-600 dark:text-slate-400">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                {t('instructor.how_saving_works_title')}
              </h4>
              <p className="leading-relaxed">
                {t('instructor.how_saving_works_desc')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: COMPARTIR ENLACE CON APRENDICES */}
      {activeTab === 'sharing' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('instructor.share_direct_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('instructor.share_direct_desc')}
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={apprenticeLink}
                className="w-full bg-transparent px-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#39A900] hover:bg-[#329600] text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? t('instructor.copied') : t('instructor.copy')}</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('instructor.share_template_title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('instructor.share_template_desc')}
                </p>
              </div>

              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-[#39A900]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? t('instructor.message_copied') : t('instructor.copy_text')}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
              {inviteMessage}
            </pre>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Ficha de Aprendiz Seleccionado */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#39A900] text-white flex items-center justify-center font-bold text-sm">
                  {selectedLearner.fullName.charAt(0)}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedLearner.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedLearner.documentType}: {selectedLearner.documentNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t('instructor.modal_program')}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedLearner.programaFormacion}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t('instructor.modal_ficha')}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedLearner.numeroFicha}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t('instructor.modal_regional')}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedLearner.regional}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t('instructor.modal_score')}</span>
                  <span className="font-bold text-[#39A900] text-sm">
                    {selectedLearner.finalExamScore}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('instructor.modal_modules')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLearner.completedModules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('instructor.modal_cases')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLearner.completedScenarios}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('instructor.modal_cert_code')}</span>
                  <span className="font-mono text-[11px] font-bold text-[#00324D] dark:text-emerald-400">{selectedLearner.certificateCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('instructor.modal_reg_date')}</span>
                  <span className="text-slate-600 dark:text-slate-400">{selectedLearner.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedLearner(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
