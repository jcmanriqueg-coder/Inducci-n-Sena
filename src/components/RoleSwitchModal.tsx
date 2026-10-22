/**
 * @file src/components/RoleSwitchModal.tsx
 * Modal de cambio de perfil entre Aprendiz e Instructor con protección por clave de acceso
 */

import React, { useState } from 'react';
import { Shield, User, KeyRound, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { AppRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
}

const INSTRUCTOR_PIN = 'Sena1234';

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const { t } = useLanguage();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === 'sena1234') {
      onSelectRole('instructor');
      setPinInput('');
      setErrorMsg(null);
      onClose();
    } else {
      setErrorMsg(t('role_modal.pin_error'));
    }
  };

  const handleSelectAprendiz = () => {
    onSelectRole('aprendiz');
    setPinInput('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#39A900]" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              {t('role_modal.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          {t('role_modal.desc')}
        </p>

        {/* Opción Aprendiz */}
        <div
          onClick={handleSelectAprendiz}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            currentRole === 'aprendiz'
              ? 'border-[#39A900] bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#39A900]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('role_modal.learner_title')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {t('role_modal.learner_desc')}
                </p>
              </div>
            </div>
            {currentRole === 'aprendiz' && (
              <span className="text-[10px] font-bold text-[#39A900] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 rounded">
                {t('role_modal.active')}
              </span>
            )}
          </div>
        </div>

        {/* Opción Instructor */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            currentRole === 'instructor'
              ? 'border-[#39A900] bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{t('role_modal.instructor_title')}</span>
                  <Lock className="w-3 h-3 text-slate-400" />
                </h3>
                <p className="text-[11px] text-slate-500">
                  {t('role_modal.instructor_desc')}
                </p>
              </div>
            </div>
            {currentRole === 'instructor' && (
              <span className="text-[10px] font-bold text-[#39A900] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 rounded">
                {t('role_modal.active')}
              </span>
            )}
          </div>

          {currentRole !== 'instructor' ? (
            <form onSubmit={handleSelectInstructor} className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
                {t('role_modal.pin_label')}
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder={t('role_modal.pin_ph')}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#39A900] hover:bg-[#329600] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {t('role_modal.pin_submit')}
                </button>
              </div>
              {errorMsg && (
                <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          ) : (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              {t('role_modal.instructor_notice')}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t('role_modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
