import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Award, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  MapPin,
  Users
} from 'lucide-react';
import { RealCaseScenario, ScenarioChoice, UserInductionProgress } from '../types';
import { CASE_SCENARIOS } from '../data/scenarioData';
import { playSound, triggerConfetti } from '../utils/storage';

interface ScenarioSimulatorProps {
  progress: UserInductionProgress;
  onSolveScenario: (scenarioId: string, xp: number) => void;
  onGoToRoadmap: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  progress,
  onSolveScenario,
  onGoToRoadmap,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  const [resolvedCases, setResolvedCases] = useState<Record<string, ScenarioChoice>>({});

  const currentCase = CASE_SCENARIOS[selectedCaseIndex] || CASE_SCENARIOS[0];
  const isCurrentResolved = !!resolvedCases[currentCase.id];
  const activeResult = resolvedCases[currentCase.id] || selectedChoice;

  const handleChoose = (choice: ScenarioChoice) => {
    playSound('click');
    setSelectedChoice(choice);
  };

  const handleConfirmDecision = () => {
    if (!selectedChoice) return;

    if (selectedChoice.isBestDecision) {
      playSound('correct');
      triggerConfetti('small');
    } else {
      playSound('wrong');
    }

    setResolvedCases((prev) => ({
      ...prev,
      [currentCase.id]: selectedChoice,
    }));

    onSolveScenario(currentCase.id, selectedChoice.xpGained);
  };

  const handleRetryCase = () => {
    playSound('click');
    setSelectedChoice(null);
    const updated = { ...resolvedCases };
    delete updated[currentCase.id];
    setResolvedCases(updated);
  };

  const solvedCount = Object.keys(resolvedCases).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Simulator Header */}
      <div className="p-6 bg-gradient-to-r from-[#00324D] to-slate-900 text-white rounded-3xl shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Compass className="w-4 h-4" />
              <span>Simulador de Toma de Decisiones Éticas y Reglamentarias</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Dilemas Reales del Aprendiz SENA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Enfréntate a situaciones de la vida real en los ambientes de formación y plataformas del SENA. Analiza las alternativas conforme al <strong className="text-white">Acuerdo 009 de 2024</strong> y comprende las consecuencias formativas o disciplinarias.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <div className="text-xs text-slate-300">Casos Resueltos</div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {solvedCount} / {CASE_SCENARIOS.length}
            </div>
            <div className="text-[11px] text-emerald-300 font-mono mt-0.5">
              Acuerdo 009 de 2024
            </div>
          </div>
        </div>

        {/* Case selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-white/10 mt-6 scrollbar-none">
          {CASE_SCENARIOS.map((c, idx) => {
            const isSolved = !!resolvedCases[c.id];
            const isSelected = idx === selectedCaseIndex;

            return (
              <button
                key={c.id}
                onClick={() => {
                  playSound('click');
                  setSelectedCaseIndex(idx);
                  setSelectedChoice(resolvedCases[c.id] || null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#39A900] text-white shadow-sm'
                    : isSolved
                    ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>Caso {idx + 1}</span>
                {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Dilemma Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenario Context & Narrative */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-5 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{currentCase.moduleCategory}</span>
              <span className="font-mono">Caso {selectedCaseIndex + 1} de {CASE_SCENARIOS.length}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentCase.title}
            </h2>

            {/* Context meta chips */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#39A900] shrink-0" />
                <span><strong>Ambiente:</strong> {currentCase.contextLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00324D] dark:text-emerald-400 shrink-0" />
                <span><strong>Personajes:</strong> {currentCase.characters}</span>
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              <p className="font-medium text-slate-900 dark:text-white">Situación Planteada:</p>
              <p className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed text-slate-800 dark:text-slate-200">
                "{currentCase.situation}"
              </p>
            </div>

            {/* Dilemma Question */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">El Dilema Ético:</div>
              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-medium">
                {currentCase.dilemma}
              </p>
            </div>
          </div>
        </div>

        {/* Decision Options & Outcome Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-5 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ¿Qué decisión recomiendas tomar?
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentCase.choices.map((choice, cIdx) => {
                const isSelected = (selectedChoice?.id === choice.id) || (resolvedCases[currentCase.id]?.id === choice.id);
                const isResolved = !!resolvedCases[currentCase.id];

                let cardClasses = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200';

                if (isResolved) {
                  if (choice.isBestDecision) {
                    cardClasses = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
                  } else if (isSelected && !choice.isBestDecision) {
                    cardClasses = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200';
                  } else {
                    cardClasses = 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60 text-slate-700 dark:text-slate-400';
                  }
                } else if (isSelected) {
                  cardClasses = 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] ring-1 ring-[#39A900] text-slate-950 dark:text-white';
                }

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={isResolved}
                    onClick={() => handleChoose(choice)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${cardClasses}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected
                          ? 'bg-[#39A900] text-white'
                          : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + cIdx)}
                    </span>
                    <div className="flex-1">
                      <div className="leading-snug">{choice.actionText}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Decision Confirmation or Outcome Display */}
            {!isCurrentResolved ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="button"
                  disabled={!selectedChoice}
                  onClick={handleConfirmDecision}
                  className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 ${
                    selectedChoice
                      ? 'bg-[#39A900] hover:bg-[#329200] text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Evaluar Decisión</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                {/* Result Card */}
                <div
                  className={`p-4 rounded-2xl border ${
                    activeResult?.consequenceType === 'success'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                      : activeResult?.consequenceType === 'warning'
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100'
                      : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold mb-1.5">
                    {activeResult?.consequenceType === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>¡Decisión Correcta! (+{activeResult?.xpGained} XP)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Decisión Desfavorable o Riesgosa</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed mb-3">
                    {activeResult?.outcomeDescription}
                  </p>
                  <div className="text-xs pt-2 border-t border-current/20 font-mono">
                    <span className="font-semibold">Fundamento Normativo:</span> {activeResult?.legalBasis}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handleRetryCase}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Probar otra opción</span>
                  </button>

                  {selectedCaseIndex < CASE_SCENARIOS.length - 1 ? (
                    <button
                      onClick={() => {
                        playSound('click');
                        const nextIdx = selectedCaseIndex + 1;
                        setSelectedCaseIndex(nextIdx);
                        setSelectedChoice(resolvedCases[CASE_SCENARIOS[nextIdx].id] || null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-700 hover:bg-[#002538] dark:hover:bg-emerald-600 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Siguiente Caso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        playSound('click');
                        onGoToRoadmap();
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Volver a la Ruta</span>
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
