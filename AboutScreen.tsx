import React from 'react';
import { BackIcon, RobotIcon, TelegramIcon, EmailIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface AboutScreenProps {
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('aboutHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center text-center">
          <RobotIcon className="w-24 h-24" />
          <h2 className="text-2xl font-bold mt-4">{t('haile')}</h2>
          <p className="text-sm text-[var(--accent-primary)]">{t('appSlogan')}</p>
          <p className="mt-6 text-[var(--text-secondary)] text-base">
            {t('aboutDescription')}
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-center">{t('aboutFeaturesTitle')}</h3>
          <ul className="space-y-3">
            <FeatureItem text={t('featureAIAnswers')} />
            <FeatureItem text={t('featureFileUploads')} />
            <FeatureItem text={t('featureStudyTools')} />
            <FeatureItem text={t('featureMultilingual')} />
          </ul>
        </div>

        <div className="mt-10 text-center">
            <a 
                href="https://t.me/haileedu_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[var(--background-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold py-3 px-6 rounded-lg hover:bg-[var(--accent-secondary)]/20 transition-colors"
            >
                <TelegramIcon className="w-6 h-6" />
                <span>{t('aboutJoinTelegram')}</span>
            </a>
            <p className="text-sm text-[var(--text-secondary)] mt-3">{t('aboutTelegramDescription')}</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-4">{t('aboutContactDescription')}</p>
          <a
            href="mailto:haileedubot@gmail.com"
            className="inline-flex items-center justify-center gap-3 bg-[var(--background-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold py-3 px-6 rounded-lg hover:bg-[var(--accent-secondary)]/20 transition-colors"
          >
            <EmailIcon className="w-6 h-6" />
            <span>{t('aboutContactEmail')}</span>
          </a>
        </div>
        
        <div className="text-center mt-12 text-xs text-[var(--text-secondary)]">
            <div className="mb-6">
                <p className="text-sm">Developed with <span className="text-[var(--destructive)]">❤️</span> by</p>
                <div className="inline-block mt-1">
                    <h3 className="text-xl font-semibold tracking-wider animated-gradient-text typing-effect">Hailemariam Tesfaye</h3>
                </div>
            </div>
          <p>{t('appVersion')}</p>
          <p>{t('copyright')}</p>
        </div>
      </main>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center gap-3 bg-[var(--background-secondary)] p-3 rounded-lg">
    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
        <svg className="w-3 h-3 text-[var(--accent-primary)]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
        </svg>
    </div>
    <span className="text-sm text-[var(--text-primary)]">{text}</span>
  </li>
);

export default AboutScreen;