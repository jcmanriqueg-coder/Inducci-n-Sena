import { 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Compass, 
  Trophy, 
  Flame,
  FileCheck2,
  Clock,
  Play,
  FileSpreadsheet
} from 'lucide-react';
import { ApprenticeProfile, UserInductionProgress, Badge } from '../types';
import { INDUCTION_MODULES, SENA_BADGES } from '../data/regulationData';
import { playSound } from '../utils/storage';

interface InductionRoadmapProps {
  profile: ApprenticeProfile;
  progress: UserInductionProgress;
  onSelectModule: (moduleId: string) => void;
  onGoToSimulator: () => void;
  onGoToExam: () => void;
  onGoToCertificate: () => void;
  onOpenGoogleSync?: () => void;
}

export const InductionRoadmap: React.FC<InductionRoadmapProps> = ({
  profile,
  progress,
  onSelectModule,
  onGoToSimulator,
  onGoToExam,
  onGoToCertificate,
  onOpenGoogleSync,
}) => {
  const completedCount = progress.completedModules.length;
  const totalModules = INDUCTION_MODULES.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);
  const level = Math.floor(progress.totalXp / 250) + 1;
  const nextLevelXp = level * 250;
  const currentLevelBaseXp = (level - 1) * 250;
  const xpInCurrentLevel = progress.totalXp - currentLevelBaseXp;
  const levelPercent = Math.min(100, Math.round((xpInCurrentLevel / 250) * 100));

  // Determine apprentice title by level
  const rankTitle =
    level === 1
      ? 'Aprendiz en Inducción'
      : level === 2
      ? 'Explorador del Reglamento'
      : level === 3
      ? 'Conocedor Institucional'
      : level === 4
      ? 'Líder en Convivencia'
      : 'Embajador Integral SENA';

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/sena_campus_learning_hub_1792526620089.jpg"
            alt="Campus de Formación SENA"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3">
            <span>SENA · Servicio Nacional de Aprendizaje</span>
            <span>/</span>
            <span>Acuerdo 009 de 2024</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance">
            Bienvenido a tu Inducción SENA,{' '}
            <span className="text-[#39A900]">{profile.fullName.split(' ')[0]}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            Descubre tus derechos, deberes, garantías formativas y el régimen disciplinario que rige tu vida como aprendiz. Supera las 6 estaciones pedagógicas, resuelve dilemas reales y obtén tu <strong className="text-white">Certificado Oficial de Inducción</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound('click');
                // Find first uncompleted module or module 1
                const nextMod = INDUCTION_MODULES.find(m => !progress.completedModules.includes(m.id)) || INDUCTION_MODULES[0];
                onSelectModule(nextMod.id);
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{completedCount === 0 ? 'Iniciar Inducción' : 'Continuar Módulos'}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onGoToSimulator();
              }}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Simulador de Casos</span>
            </button>

            {progress.isCertified ? (
              <button
                onClick={() => {
                  playSound('click');
                  onGoToCertificate();
                }}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>Ver Mi Certificado Oficial</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playSound('click');
                  onGoToExam();
                }}
                className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-slate-400" />
                <span>Evaluación de Certificación</span>
              </button>
            )}

            {onOpenGoogleSync && (
              <button
                onClick={() => {
                  playSound('click');
                  onOpenGoogleSync();
                }}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-xl transition-colors flex items-center gap-2"
                title="Sincronizar y registrar datos en Google Sheets de Google Drive"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#39A900]" />
                <span>Almacenar en Google Drive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats & Apprentice Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rango del Aprendiz</div>
          <div className="text-base font-bold text-slate-900 dark:text-white truncate">{rankTitle}</div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono">
            <span className="text-[#39A900] font-semibold">Nivel {level}</span>
            <span>·</span>
            <span>Ficha {profile.numeroFicha}</span>
          </div>
        </div>

        {/* XP Tracker */}
        <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Experiencia (XP)</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{progress.totalXp} XP</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
            {xpInCurrentLevel} / 250 XP
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-[#39A900] rounded-full transition-all duration-500"
              style={{ width: `${levelPercent}%` }}
            />
          </div>
        </div>

        {/* Modules Progress */}
        <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Avance de Módulos</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{progressPercent}%</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
            {completedCount} de {totalModules} Módulos
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-[#00324D] dark:bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Badges / Certification */}
        <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Estado de Certificación</div>
          <div className="flex items-center gap-1.5 text-base font-bold">
            {progress.isCertified ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Aprobado
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> En Formación
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {progress.badges.length} insignias desbloqueadas
          </div>
        </div>
      </div>

      {/* Structured Induction Journey (6 Stations) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ruta de Formación: Reglamento del Aprendiz</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              6 módulos estructurados según el Acuerdo 009 de 2024 para conocer tus derechos, deberes y debido proceso.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            Acuerdo 009 / 2024
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUCTION_MODULES.map((module, idx) => {
            const isCompleted = progress.completedModules.includes(module.id);
            const isCurrent = !isCompleted && (idx === 0 || progress.completedModules.includes(INDUCTION_MODULES[idx - 1].id));

            return (
              <div
                key={module.id}
                onClick={() => {
                  playSound('click');
                  onSelectModule(module.id);
                }}
                className={`group relative p-6 bg-white dark:bg-slate-900/90 border rounded-2xl transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : isCurrent
                    ? 'border-[#39A900] ring-1 ring-[#39A900]/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-mono font-medium text-slate-600 dark:text-slate-400">
                      Estación {module.order} de {totalModules}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 dark:text-slate-500">{module.durationMinutes} min</span>
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">+{module.xpReward} XP</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors mb-2">
                    {module.shortTitle}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-200 mb-0.5">Capítulos Clave:</div>
                    <ul className="space-y-0.5 list-disc list-inside">
                      {module.chapters.map((ch) => (
                        <li key={ch.id} className="truncate">
                          {ch.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  {isCompleted ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Completado
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pendiente
                    </span>
                  )}

                  <div className="flex items-center gap-1 font-semibold text-[#39A900] group-hover:translate-x-1 transition-transform">
                    <span>{isCompleted ? 'Repasar' : 'Ingresar'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two interactive spotlight callouts: Simulator & Certification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dilemma Simulator Card */}
        <div className="p-6 bg-gradient-to-br from-emerald-900 to-[#00324D] text-white rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
              <Compass className="w-4 h-4" />
              <span>Práctica Gamificada</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Simulador de Dilemas y Casos Reales</h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
              Enfréntate a 5 situaciones cotidianas del aprendiz: entregas bajo presión, inasistencias médicas, seguridad en talleres, audiencias de descargos y bienestar.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-slate-300">
              {progress.completedScenarios.length} casos resueltos
            </span>
            <button
              onClick={() => {
                playSound('click');
                onGoToSimulator();
              }}
              className="px-4 py-2 text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Entrar al Simulador</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00324D] dark:text-emerald-400 mb-2">
              <Award className="w-4 h-4 text-[#39A900]" />
              <span>Acreditación Institucional</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Certificado de Inducción SENA</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Supera la evaluación de 8 preguntas sobre el Acuerdo 009 de 2024 para generar tu certificado oficial con sello digital, código QR de verificación e imprimirlo.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {progress.isCertified ? 'Certificado emitido' : 'Requiere min. 80% en el test'}
            </span>
            <button
              onClick={() => {
                playSound('click');
                if (progress.isCertified) {
                  onGoToCertificate();
                } else {
                  onGoToExam();
                }
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 ${
                progress.isCertified
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-[#39A900] hover:bg-[#329200] text-white'
              }`}
            >
              <span>{progress.isCertified ? 'Ver Certificado' : 'Presentar Evaluación'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Badges Locker */}
      <section className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Insignias y Logros del Aprendiz</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Colecciona insignias a medida que avanzas en el reglamento.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
            {progress.badges.length} / {SENA_BADGES.length} Ganadas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SENA_BADGES.map((b) => {
            const isUnlocked = progress.badges.includes(b.id) || (b.id === 'badge-graduado-induccion' && progress.isCertified);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 mx-auto rounded-xl flex items-center justify-center mb-2.5 ${
                    isUnlocked
                      ? 'bg-[#39A900] text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{b.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-2 line-clamp-2">{b.description}</p>
                <span className="text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  +{b.xpValue} XP
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
