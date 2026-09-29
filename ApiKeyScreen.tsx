import React, { useState } from 'react';
import { RobotIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface ApiKeyScreenProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onApiKeySubmit }) => {
  const [key, setKey] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onApiKeySubmit(key.trim());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <RobotIcon className="w-24 h-24 mx-auto" />
        <h1 className="text-3xl font-bold tracking-wider mt-6">{t('haile')}</h1>
        <p className="text-lg text-[var(--accent-primary)] mb-8">{t('appSlogan')}</p>
        
        <div className="bg-[var(--background-secondary)] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">{t('apiKeyWelcome')}</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">
            {t('apiKeyInstruction')}
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={t('apiKeyPlaceholder')}
              className="w-full bg-[var(--background-tertiary)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              aria-label="Gemini API Key"
            />
            <button
              type="submit"
              disabled={!key.trim()}
              className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
            >
              {t('apiKeySave')}
            </button>
          </form>
          <p className="text-xs text-[var(--text-secondary)] mt-4">
            {t('apiKeyGet')} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--accent-primary)]">{t('apiKeyGoogleAIStudio')}</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyScreen;
