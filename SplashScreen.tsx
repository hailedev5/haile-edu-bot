import React from 'react';
import { RobotIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

const SplashScreen: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] items-center justify-center select-none">
      <div className="animate-fade-in-scale">
        <RobotIcon className="w-28 h-28" />
      </div>
      <div 
        className="mt-6 text-center animate-fade-in-scale" 
        style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
      >
        <h1 className="text-3xl font-bold tracking-wider">{t('haile')}</h1>
        <p className="text-lg text-[var(--accent-primary)]">{t('appSlogan')}</p>
      </div>
    </div>
  );
};

export default SplashScreen;