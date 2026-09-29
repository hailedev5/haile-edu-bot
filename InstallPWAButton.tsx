import React from 'react';
import { DownloadIcon, XIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface InstallPWAButtonProps {
  onInstall: () => void;
  onDismiss: () => void;
}

const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ onInstall, onDismiss }) => {
  const { t } = useI18n();

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-50" role="alert" aria-live="assertive">
      <div className="bg-[var(--background-secondary)]/90 backdrop-blur-md rounded-xl p-4 flex items-center justify-between gap-4 shadow-2xl animate-slide-in-up">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 p-2 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full">
            <DownloadIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{t('settingsInstallApp')}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">For the best app experience.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={onInstall}
            className="bg-[var(--accent-primary)] text-white font-bold text-sm py-2 px-4 rounded-full hover:bg-[var(--accent-primary-hover)] transition-colors"
          >
            Install
          </button>
          <button 
            onClick={onDismiss}
            className="p-2 text-[var(--text-secondary)] hover:bg-white/10 rounded-full"
            aria-label="Dismiss install prompt"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAButton;
