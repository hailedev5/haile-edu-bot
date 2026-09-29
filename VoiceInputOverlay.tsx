import React from 'react';
import { MicIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface VoiceInputOverlayProps {
  isVisible: boolean;
  transcript: string;
  onClose: () => void;
}

const VoiceInputOverlay: React.FC<VoiceInputOverlayProps> = ({ isVisible, transcript, onClose }) => {
  const { t } = useI18n();

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-[var(--background-primary)]/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 animate-fade-in-scale"
      style={{ animationDuration: '0.2s' }}
      onClick={onClose}
    >
      <div className="w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
        <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-[var(--destructive)]/30 rounded-full animate-pulse"></div>
            <button 
                onClick={onClose}
                className="relative w-32 h-32 bg-[var(--background-secondary)] rounded-full flex items-center justify-center border-4 border-[var(--destructive)]"
                aria-label={t('stop')}
            >
                <MicIcon className="w-14 h-14 text-[var(--destructive)]" />
            </button>
        </div>
        
        <p className="text-xl font-medium text-white min-h-[60px] p-2">
          {transcript || t('listening')}
        </p>
      </div>
    </div>
  );
};

export default VoiceInputOverlay;
