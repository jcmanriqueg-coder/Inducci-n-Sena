import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  Share2, 
  CheckCircle, 
  Award, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  User, 
  Building,
  QrCode,
  Edit3,
  FileSpreadsheet
} from 'lucide-react';
import { ApprenticeProfile, UserInductionProgress } from '../types';
import { playSound } from '../utils/storage';

interface CertificateViewProps {
  profile: ApprenticeProfile;
  progress: UserInductionProgress;
  onOpenEditProfile: () => void;
  onGoBackToRoadmap: () => void;
  onOpenGoogleSync?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  progress,
  onOpenEditProfile,
  onGoBackToRoadmap,
  onOpenGoogleSync,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const issueDate = progress.certifiedDate || '20 de Octubre de 2025';
  const certCode = progress.certificateCode || `SENA-IND-2025-${profile.documentNumber.slice(-4)}98`;
  const score = progress.finalExamScore || 100;

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  const handleShare = () => {
    playSound('click');
    if (navigator.share) {
      navigator
        .share({
          title: `Certificado de Inducción SENA - ${profile.fullName}`,
          text: `¡Completé exitosamente la Inducción Institucional y el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024)! Código de validación: ${certCode}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Certificado de Inducción SENA (Acuerdo 009 de 2024) - Aprendiz: ${profile.fullName} - Código: ${certCode}`
      );
      alert('Información del certificado copiada al portapapeles.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top action toolbar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-[#39A900]" />
            <span>Documento Oficial Acreditado</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Certificado de Inducción SENA (Acuerdo 009 de 2024)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenEditProfile}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            title="Modificar nombre o datos personales"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Datos</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartir</span>
          </button>

          {onOpenGoogleSync && (
            <button
              onClick={onOpenGoogleSync}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors flex items-center gap-1.5"
              title="Registrar y guardar constancia en Google Sheets de Google Drive"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400" />
              <span>Guardar en Google Drive</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div
        ref={certificateRef}
        className="certificate-container relative max-w-4xl mx-auto bg-white border-8 border-double border-[#00324D] rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl text-slate-900 print:border-4 print:p-6 print:shadow-none"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#39A900]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#39A900]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#39A900]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#39A900]" />

        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b-2 border-[#39A900]/40 pb-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span>República de Colombia</span>
            <span>·</span>
            <span>Ministerio del Trabajo</span>
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="w-10 h-10 rounded-xl bg-[#39A900] flex items-center justify-center text-white font-black text-xl shadow-sm">
              S
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#00324D]">
              SERVICIO NACIONAL DE APRENDIZAJE · SENA
            </h1>
          </div>

          <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
            Formación Profesional Integral de los Trabajadores Colombianos
          </p>

          <div className="pt-2">
            <span className="inline-block px-4 py-1 text-xs font-extrabold tracking-wider text-emerald-900 bg-emerald-100 rounded-full uppercase">
              Constancia Oficial de Inducción
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center space-y-6">
          <p className="text-xs sm:text-sm font-serif italic text-slate-600">
            El Subdirector del Centro de Formación y el Coordinador Académico hacen constar que:
          </p>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#00324D] tracking-tight uppercase font-display">
              {profile.fullName}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-700">
              Identificado(a) con {profile.documentType} No. {profile.documentNumber}
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            Completó y aprobó satisfactoriamente las actividades pedagógicas, módulos temáticos y evaluaciones correspondientes a la <strong className="text-slate-900 font-semibold">Inducción Institucional sobre el Reglamento del Aprendiz SENA</strong> (regulado por el <strong className="text-slate-900">Acuerdo 009 de 2024</strong>), demostrando apropiación plena de sus derechos formativos, deberes éticos, prohibiciones, medidas pedagógicas, garantías del debido proceso y trámites de novedades académicas.
          </p>

          {/* Academic Details Grid */}
          <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Programa:</span>
              <span className="font-semibold text-slate-900 truncate block">
                {profile.programaFormacion}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Ficha de Caracterización:</span>
              <span className="font-mono font-semibold text-slate-900 block">
                {profile.numeroFicha}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Regional:</span>
              <span className="font-semibold text-slate-900 truncate block">
                {profile.regional}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Calificación Obtenida:</span>
              <span className="font-bold text-[#39A900] block">
                {score}% de Aprovechamiento (Aprobado)
              </span>
            </div>
          </div>

          {/* Center Seal Visual */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white shadow-md border-2 border-amber-300">
              <img
                src="/src/assets/images/sena_certificate_seal_1792526620089.jpg"
                alt="Sello de Certificación SENA"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Signatures & Verification Row */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="w-36 h-10 mx-auto border-b border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-sm text-slate-600">Subdirección Centro</span>
              </div>
              <div className="text-xs font-bold text-slate-900">Dr. Hernando Gómez R.</div>
              <div className="text-[10px] text-slate-500">Subdirector de Centro de Formación</div>
            </div>

            {/* QR Code / Digital Verification */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="w-16 h-16 mx-auto bg-white border border-slate-300 p-1 rounded-lg flex items-center justify-center">
                {/* Clean inline SVG QR representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <path fill="currentColor" d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z" />
                  <path fill="currentColor" d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z" />
                  <path fill="currentColor" d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z" />
                  <path fill="currentColor" d="M50,15 h6 v6 h-6 z M50,30 h6 v6 h-6 z M15,50 h6 v6 h-6 z M30,50 h6 v6 h-6 z M50,50 h10 v10 h-10 z M65,60 h10 v6 h-10 z M80,60 h10 v10 h-10 z M60,80 h15 v10 h-15 z M85,80 h5 v10 h-5 z" />
                </svg>
              </div>
              <div className="text-[10px] font-mono font-semibold text-slate-800">
                {certCode}
              </div>
              <div className="text-[9px] text-slate-500">Verificable en plataforma SENA</div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="w-36 h-10 mx-auto border-b border-slate-400 flex items-center justify-center">
                <span className="font-serif italic text-sm text-slate-600">Coord. Académica</span>
              </div>
              <div className="text-xs font-bold text-slate-900">Mg. Claudia Patricia Morales</div>
              <div className="text-[10px] text-slate-500">Coordinadora de Formación Integral</div>
            </div>
          </div>

          {/* Certificate footer note */}
          <div className="pt-4 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            <span>Expedido el: <strong>{issueDate}</strong></span>
            <span>Norma: <strong>Acuerdo 009 de 2024 (Reglamento del Aprendiz)</strong></span>
            <span>Servicio Nacional de Aprendizaje SENA · Colombia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
