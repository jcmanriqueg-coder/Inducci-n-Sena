import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageToggleProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  const isSpanish = language === 'es';
  const label = isSpanish ? 'ES' : 'EN';
  const nextLangLabel = isSpanish ? 'English (EN)' : 'Español (ES)';
  const tooltipText = isSpanish
    ? 'Cambiar idioma a Inglés (Switch to English)'
    : 'Switch language to Spanish (Cambiar a Español)';

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        title={tooltipText}
        aria-label={tooltipText}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none ${
          isSpanish
            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
        } ${className}`}
      >
        <Languages className="w-4 h-4 text-[#39A900] shrink-0" />
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-bold">{label}</span>
          <span className="text-[11px] opacity-75 font-normal">· {nextLangLabel}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={tooltipText}
      aria-label={tooltipText}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] ${
        isSpanish
          ? 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          : 'bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
      } ${className}`}
    >
      <Languages className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
      <span className="font-mono tracking-wider font-extrabold text-[11px]">{label}</span>
      <span className="sr-only">{tooltipText}</span>
    </button>
  );
};
