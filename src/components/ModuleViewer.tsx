import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Award,
  AlertCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { ModuleData, UserInductionProgress } from '../types';
import { INDUCTION_MODULES } from '../data/regulationData';
import { playSound, triggerConfetti } from '../utils/storage';

interface ModuleViewerProps {
  moduleId: string;
  progress: UserInductionProgress;
  onBackToRoadmap: () => void;
  onCompleteModule: (moduleId: string, scoreGained: number, badgeId: string) => void;
  onSelectNextModule: (nextId: string) => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  moduleId,
  progress,
  onBackToRoadmap,
  onCompleteModule,
  onSelectNextModule,
}) => {
  const currentModule = INDUCTION_MODULES.find((m) => m.id === moduleId) || INDUCTION_MODULES[0];
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  const currentChapter = currentModule.chapters[activeChapterIndex] || currentModule.chapters[0];
  const isModuleCompleted = progress.completedModules.includes(currentModule.id);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    playSound('click');
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleEvaluateQuiz = () => {
    // Check all questions answered
    const unanswered = currentModule.quiz.some((q) => !selectedAnswers[q.id]);
    if (unanswered) {
      alert('Por favor responde todas las preguntas del módulo antes de validar.');
      return;
    }

    setQuizSubmitted(true);
    let totalScore = 0;
    let correctCount = 0;

    currentModule.quiz.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      const selectedOpt = q.options.find((o) => o.id === selectedId);
      if (selectedOpt && selectedOpt.isCorrect) {
        totalScore += q.points;
        correctCount += 1;
      }
    });

    const isPassed = correctCount === currentModule.quiz.length;

    if (isPassed) {
      playSound('correct');
      triggerConfetti('small');
      onCompleteModule(currentModule.id, currentModule.xpReward, currentModule.badgeId);
    } else {
      playSound('wrong');
    }
  };

  const handleResetQuiz = () => {
    playSound('click');
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  // Find next module
  const currentIdx = INDUCTION_MODULES.findIndex((m) => m.id === currentModule.id);
  const nextModule = INDUCTION_MODULES[currentIdx + 1];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header bar with module info and back action */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSound('click');
              onBackToRoadmap();
            }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Volver a la ruta general"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Módulo {currentModule.order} de {INDUCTION_MODULES.length}</span>
              <span>·</span>
              <span>{currentModule.durationMinutes} minutos</span>
              <span>·</span>
              <span className="font-mono">+{currentModule.xpReward} XP</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{currentModule.title}</h1>
          </div>
        </div>

        {/* View Switcher: Content vs Checkpoint Quiz */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('content');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'content'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Contenido Pedagógico
          </button>
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('quiz');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-[#39A900] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desafío de Validación</span>
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapter Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Temas de este Módulo
              </h3>
              <div className="space-y-2">
                {currentModule.chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => {
                      playSound('click');
                      setActiveChapterIndex(idx);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      activeChapterIndex === idx
                        ? 'border-[#39A900] bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-0.5">{chap.articleRef}</div>
                    <div className="text-xs leading-snug">{chap.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Challenge Banner in sidebar */}
            <div className="p-4 bg-[#00324D] dark:bg-slate-900 text-white rounded-2xl shadow-xs space-y-2 border border-transparent dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <Lightbulb className="w-4 h-4" />
                <span>Comprobación Rápida</span>
              </div>
              <p className="text-xs text-slate-200 dark:text-slate-300 leading-relaxed">
                Al terminar de leer los temas, realiza el Desafío de Validación para desbloquear tu insignia institucional y sumar <strong className="text-emerald-300">+{currentModule.xpReward} XP</strong>.
              </p>
              <button
                onClick={() => {
                  playSound('click');
                  setActiveTab('quiz');
                }}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-xs"
              >
                Ir al Desafío del Módulo
              </button>
            </div>
          </div>

          {/* Main Reading Stage (Left / Top Zone in Education design) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-6 transition-colors">
              {/* Chapter Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#39A900] mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{currentChapter.articleRef}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-balance">
                  {currentChapter.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                  {currentChapter.summary}
                </p>
              </div>

              {/* Chapter Detailed Prose */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                {currentChapter.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Highlights callout */}
              <div className="p-4 sm:p-5 bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                  <span>Puntos Clave del Reglamento (Acuerdo 009 de 2024):</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                  {currentChapter.keyHighlights.map((hl, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="text-[#39A900] font-bold">✓</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Application Example */}
              {currentChapter.practicalApplication && (
                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Aplicación Práctica en tu Vida como Aprendiz:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentChapter.practicalApplication}
                  </p>
                </div>
              )}

              {/* Chapter Paging Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  disabled={activeChapterIndex === 0}
                  onClick={() => {
                    playSound('click');
                    setActiveChapterIndex(activeChapterIndex - 1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeChapterIndex === 0
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Tema Anterior</span>
                </button>

                {activeChapterIndex < currentModule.chapters.length - 1 ? (
                  <button
                    onClick={() => {
                      playSound('click');
                      setActiveChapterIndex(activeChapterIndex + 1);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-700 hover:bg-[#002538] dark:hover:bg-emerald-600 rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Siguiente Tema</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playSound('click');
                      setActiveTab('quiz');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Pasar al Desafío de Validación</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz / Checkpoint Stage */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-6 transition-colors">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] mb-1">
                <Award className="w-4 h-4" />
                <span>Validación Gamificada de Competencias</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Desafío: {currentModule.shortTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Responde correctamente las preguntas basadas en el Acuerdo 009 de 2024 para completar el módulo y ganar tu insignia.
              </p>
            </div>

            <div className="space-y-6">
              {currentModule.quiz.map((q, qIndex) => {
                const selectedOptId = selectedAnswers[q.id];

                return (
                  <div key={q.id} className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Pregunta {qIndex + 1} de {currentModule.quiz.length}</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">+{q.points} XP</span>
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        const isChosen = selectedOptId === opt.id;
                        let optionStyle = 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600';

                        if (quizSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
                          } else if (isChosen && !opt.isCorrect) {
                            optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-emerald-50/80 dark:bg-emerald-950/50 border-[#39A900] text-slate-950 dark:text-white ring-1 ring-[#39A900] font-medium';
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                                isChosen
                                  ? 'bg-[#39A900] text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                              }`}
                            >
                              {opt.id.split('-').pop()?.toUpperCase()}
                            </span>
                            <div className="flex-1">
                              <div>{opt.text}</div>
                              {quizSubmitted && (
                                <div className="mt-2 text-xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                                  <span className="font-semibold">{opt.isCorrect ? '✓ Correcto:' : '✗ Motivo:'}</span>{' '}
                                  {opt.explanation}
                                  <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Base legal: {opt.articleRef}
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveTab('content');
                }}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              >
                ← Volver a repasar lectura
              </button>

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleEvaluateQuiz}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validar Respuestas</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Reintentar
                  </button>

                  {nextModule ? (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        onSelectNextModule(nextModule.id);
                        setActiveTab('content');
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                        setActiveChapterIndex(0);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-700 hover:bg-[#002538] dark:hover:bg-emerald-600 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Avanzar al Módulo {nextModule.order}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        onBackToRoadmap();
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Ver Ruta Completa</span>
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
