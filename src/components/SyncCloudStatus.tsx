/**
 * @file src/components/SyncCloudStatus.tsx
 * Indicador sutil de nube para la barra de navegación que muestra en tiempo real
 * el estado de la sincronización automática con Google Sheets.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Cloud, CloudCheck, CloudOff, Loader2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { CloudSyncState } from '../hooks/useAutoGoogleSheetsSync';

interface SyncCloudStatusProps {
  syncState: CloudSyncState;
  lastSyncedAt: Date | null;
  spreadsheetUrl: string | null;
  userEmail: string | null;
  errorMessage: string | null;
  onConnect: () => Promise<boolean>;
  onForceSync: () => Promise<boolean>;
  onOpenDetailsModal: () => void;
}

export const SyncCloudStatus: React.FC<SyncCloudStatusProps> = ({
  syncState,
  lastSyncedAt,
  spreadsheetUrl,
  userEmail,
  errorMessage,
  onConnect,
  onForceSync,
  onOpenDetailsModal,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  // Format last synced time
  const formattedTime = lastSyncedAt
    ? new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastSyncedAt)
    : null;

  const handleClickMainButton = () => {
    if (syncState === 'unauthenticated') {
      onConnect();
    } else {
      setIsPopoverOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Sutil Botón de Nube en Navbar */}
      <button
        onClick={handleClickMainButton}
        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] ${
          syncState === 'synced'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
            : syncState === 'syncing'
            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
            : syncState === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/40'
            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/80'
        }`}
        title={
          syncState === 'synced'
            ? `Sincronizado automáticamente (${formattedTime || 'Todo al día'})`
            : syncState === 'syncing'
            ? 'Guardando progreso en Google Sheets...'
            : syncState === 'error'
            ? 'Error en la sincronización. Clic para reintentar.'
            : 'Conectar cuenta de Google para guardar automáticamente en Drive'
        }
        aria-label="Estado de sincronización en la nube"
      >
        {syncState === 'syncing' && (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline font-normal">Guardando...</span>
          </>
        )}

        {syncState === 'synced' && (
          <>
            <div className="relative">
              <Cloud className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400" />
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#39A900] rounded-full ring-1 ring-white dark:ring-slate-900" />
            </div>
            <span className="hidden sm:inline">Sincronizado</span>
          </>
        )}

        {syncState === 'unauthenticated' && (
          <>
            <CloudOff className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
            <span className="hidden sm:inline">Conectar Drive</span>
          </>
        )}

        {syncState === 'error' && (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Error al guardar</span>
          </>
        )}
      </button>

      {/* Mini Popover Informativo */}
      {isPopoverOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-[#39A900]" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Sincronización Automática
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                syncState === 'synced'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : syncState === 'syncing'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {syncState === 'synced' ? 'Activo' : syncState === 'syncing' ? 'En proceso' : 'Inactivo'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {userEmail && (
              <p className="truncate">
                <span className="text-slate-400 dark:text-slate-500">Cuenta: </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{userEmail}</span>
              </p>
            )}

            <p>
              <span className="text-slate-400 dark:text-slate-500">Último guardado: </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formattedTime ? `Hoy a las ${formattedTime}` : 'Pendiente del primer guardado'}
              </span>
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cada avance en módulos, simulador y examen se guarda en segundo plano en tu Google Drive sin interrumpir tu experiencia.
            </p>

            {errorMessage && (
              <div className="p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 rounded-lg text-rose-700 dark:text-rose-300 text-[11px]">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#39A900] hover:bg-[#329600] text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Hoja de Cálculo</span>
              </a>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await onForceSync();
                }}
                disabled={syncState === 'syncing'}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                <span>Guardar ahora</span>
              </button>

              <button
                onClick={() => {
                  setIsPopoverOpen(false);
                  onOpenDetailsModal();
                }}
                className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline transition-colors"
              >
                Detalles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
