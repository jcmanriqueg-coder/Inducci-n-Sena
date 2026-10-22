import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { INDUCTION_MODULES } from '../data/regulationData';

interface RegulationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
}

export const RegulationSearchModal: React.FC<RegulationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();

    const matches: Array<{
      moduleId: string;
      moduleTitle: string;
      chapterTitle: string;
      articleRef: string;
      snippet: string;
      matchedType: string;
    }> = [];

    INDUCTION_MODULES.forEach((mod) => {
      mod.chapters.forEach((ch) => {
        const titleMatch = ch.title.toLowerCase().includes(term);
        const articleMatch = ch.articleRef.toLowerCase().includes(term);
        const summaryMatch = ch.summary.toLowerCase().includes(term);
        const contentMatch = ch.content.some((c) => c.toLowerCase().includes(term));
        const practicalMatch = ch.practicalApplication?.toLowerCase().includes(term);

        if (titleMatch || articleMatch || summaryMatch || contentMatch || practicalMatch) {
          matches.push({
            moduleId: mod.id,
            moduleTitle: mod.shortTitle,
            chapterTitle: ch.title,
            articleRef: ch.articleRef,
            snippet: ch.summary,
            matchedType: titleMatch ? 'Título' : articleMatch ? 'Artículo' : 'Contenido',
          });
        }
      });
    });

    return matches;
  }, [searchTerm]);

  if (!isOpen) return null;

  const quickKeywords = [
    'Inasistencia',
    'Carné',
    'Plagio',
    'Aplazamiento',
    'Bienestar',
    'Comité de Evaluación',
    'Plan de Mejoramiento',
    'EPP',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white">
              <BookOpen className="w-5 h-5 text-[#39A900]" />
              <h3 className="font-bold text-base">Buscador del Reglamento del Aprendiz (Acuerdo 009 de 2024)</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por palabra clave: inasistencia, derechos, plagio, comité, aplazamiento..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs"
            />
          </div>

          {/* Quick Keywords */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Temas frecuentes:</span>
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchTerm(kw)}
                className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {searchTerm.trim() === '' ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-medium">Escribe una palabra o selecciona un tema frecuente arriba.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Consulta los artículos oficiales sobre derechos, deberes, sanciones y procedimientos del SENA.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm">No se encontraron artículos con el término "{searchTerm}".</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Intenta con términos más generales como "falta", "debido proceso", "sanción" o "deber".</p>
            </div>
          ) : (
            searchResults.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-800 rounded-xl transition-all group cursor-pointer"
                onClick={() => {
                  onSelectModule(item.moduleId);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-[#00324D] dark:text-emerald-400">{item.moduleTitle}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{item.articleRef}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors flex items-center justify-between">
                  <span>{item.chapterTitle}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#39A900]" />
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
