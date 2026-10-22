import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { UserInductionProgress } from '../types';
import { FINAL_EXAM_QUESTIONS } from '../data/scenarioData';
import { playSound, triggerConfetti } from '../utils/storage';

interface FinalEvaluationProps {
  progress: UserInductionProgress;
  onPassExam: (score: number, certCode: string) => void;
  onGoToCertificate: () => void;
}

export const FinalEvaluation: React.FC<FinalEvaluationProps> = ({
  progress,
  onPassExam,
  onGoToCertificate,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState<number | null>(
    progress.finalExamScore ?? null
  );

  const totalQuestions = FINAL_EXAM_QUESTIONS.length;

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    playSound('click');
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < totalQuestions) {
      alert(`Por favor responde las ${totalQuestions} preguntas antes de finalizar la evaluación.`);
      return;
    }

    let correctCount = 0;
    FINAL_EXAM_QUESTIONS.forEach((q) => {
      const selectedId = answers[q.id];
      const opt = q.options.find((o) => o.id === selectedId);
      if (opt && opt.isCorrect) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / totalQuestions) * 100);
    setScorePercentage(percent);
    setIsSubmitted(true);

    if (percent >= 80) {
      playSound('levelup');
      triggerConfetti('epic');
      const uniqueCode = `SENA-IND-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      onPassExam(percent, uniqueCode);
    } else {
      playSound('wrong');
    }
  };

  const handleReset = () => {
    playSound('click');
    setAnswers({});
    setIsSubmitted(false);
    setScorePercentage(null);
  };

  const isPassed = scorePercentage !== null && scorePercentage >= 80;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-[#00324D] to-slate-900 text-white rounded-3xl shadow-lg border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Acreditación Oficial · Acuerdo 009 de 2024</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Evaluación Final de Inducción SENA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Demuestra tu apropiación del Reglamento del Aprendiz, derechos fundamentales, deberes y debido proceso. Alcanza un puntaje mínimo del <strong className="text-white">80% (mínimo 7 de 8 aciertos)</strong> para expedir tu certificado oficial.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <div className="text-xs text-slate-300">Puntaje Mínimo</div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">80%</div>
            <div className="text-[11px] text-slate-300 mt-0.5">8 Preguntas Clave</div>
          </div>
        </div>
      </div>

      {/* Result Card if Submitted */}
      {isSubmitted && scorePercentage !== null && (
        <div
          className={`p-6 rounded-3xl border shadow-sm ${
            isPassed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isPassed ? (
                <div className="w-12 h-12 rounded-2xl bg-[#39A900] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Trophy className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold">
                  {isPassed
                    ? '¡Felicitaciones! Has Aprobado la Inducción SENA'
                    : 'Puntaje Insuficiente para Certificación'}
                </h3>
                <p className="text-xs sm:text-sm text-current/80">
                  {isPassed
                    ? `Obtuviste un ${scorePercentage}%. Tu certificado oficial de inducción ha sido generado con éxito.`
                    : `Obtuviste un ${scorePercentage}%. Revisa las justificaciones normativas y vuelve a intentarlo.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPassed ? (
                <button
                  onClick={() => {
                    playSound('click');
                    onGoToCertificate();
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Ver y Descargar Certificado</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reintentar Evaluación</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-5">
        {FINAL_EXAM_QUESTIONS.map((q, idx) => {
          const selectedId = answers[q.id];

          return (
            <div
              key={q.id}
              className="p-5 sm:p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">Pregunta {idx + 1} de {totalQuestions}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">+60 XP</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                {q.question}
              </h3>

              <div className="space-y-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = selectedId === opt.id;
                  let cardStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200';

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200';
                    } else {
                      cardStyle = 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60 text-slate-700 dark:text-slate-400';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] ring-1 ring-[#39A900] text-slate-950 dark:text-white font-medium';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${cardStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                          isSelected
                            ? 'bg-[#39A900] text-white'
                            : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {opt.id.split('-').pop()?.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <div>{opt.text}</div>
                        {isSubmitted && (
                          <div className="mt-2 text-xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                            <span className="font-semibold">{opt.isCorrect ? '✓' : '✗'}</span> {opt.explanation}
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

      {/* Submit bar */}
      {!isSubmitted && (
        <div className="p-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {Object.keys(answers).length} de {totalQuestions} respondidas
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enviar Evaluación y Obtener Certificado</span>
          </button>
        </div>
      )}
    </div>
  );
};
