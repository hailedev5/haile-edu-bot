import React from 'react';
import type { Theme } from '../App';
import type { Model } from '../types';
import { BackIcon, PaletteIcon, MoonIcon, SunIcon, TranslateIcon, ChevronDownIcon, FeedbackIcon, DataSaverIcon, LeafIcon, WaveIcon, InfoIcon, DownloadIcon, CpuIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface SettingsProps {
  onBack: () => void;
  currentTheme: Theme;
  onChangeTheme: (theme: Theme) => void;
  currentModel: Model;
  onChangeModel: (model: Model) => void;
  isInternetSavingMode: boolean;
  onSetInternetSavingMode: (enabled: boolean) => void;
  onInstallApp: () => void;
  canInstallPWA: boolean;
}

const languages = [
    { code: 'am', name: 'አማርኛ' },
    { code: 'om', name: 'Afaan Oromoo' },
    { code: 'ti', name: 'ትግርኛ' },
    { code: 'ar', name: 'العربية' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'zh', name: '中文' },
    { code: 'cs', name: 'Čeština' },
    { code: 'da', name: 'Dansk' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'fi', name: 'Suomi' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'he', name: 'עברית' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'hu', name: 'Magyar' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'no', name: 'Norsk' },
    { code: 'fa', name: 'فارسی' },
    { code: 'pl', name: 'Polski' },
    { code: 'pt', name: 'Português' },
    { code: 'ro', name: 'Română' },
    { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'sv', name: 'Svenska' },
    { code: 'th', name: 'ไทย' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ur', name: 'اردو' },
    { code: 'vi', name: 'Tiếng Việt' },
];

interface ModelButtonProps {
    model: Model;
    current: Model;
    onChange: (model: Model) => void;
    label: string;
    description: string;
}

const ModelButton: React.FC<ModelButtonProps> = ({ model, current, onChange, label, description }) => {
    const isSelected = model === current;
    return (
        <button
            onClick={() => onChange(model)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                isSelected 
                ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]' 
                : 'bg-[var(--background-tertiary)] border-transparent hover:border-[var(--border-color)]'
            }`}
            role="radio"
            aria-checked={isSelected}
        >
            <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]' : 'border-[var(--text-secondary)]'} mr-3 flex-shrink-0`}></div>
                <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{description}</p>
                </div>
            </div>
        </button>
    );
};


const Settings: React.FC<SettingsProps> = ({ onBack, currentTheme, onChangeTheme, currentModel, onChangeModel, isInternetSavingMode, onSetInternetSavingMode, onInstallApp, canInstallPWA }) => {
  const { t, language, setLanguage } = useI18n();

  const handleClearData = () => {
    if (window.confirm(t('settingsClearDataConfirm'))) {
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('savedMessages');
      alert(t('settingsDataCleared'));
    }
  };

  const handleSendFeedback = () => {
    const appVersion = '1.0.0';
    const subject = encodeURIComponent(t('feedbackEmailSubject').replace('{version}', appVersion));
    const body = encodeURIComponent(
        t('feedbackEmailBody')
            .replace('{version}', appVersion)
            .replace('{language}', language)
    );
    window.location.href = `mailto:haileedubot@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('settingsHeader')}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Appearance Section */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <PaletteIcon className="w-5 h-5" />
            {t('settingsAppearance')}
          </h2>
          <div className="bg-[var(--background-secondary)] p-4 rounded-lg">
            <label className="block text-md font-medium mb-3">{t('settingsTheme')}</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <ThemeButton theme="light" current={currentTheme} onChange={onChangeTheme} icon={<SunIcon className="w-6 h-6" />} label={t('themeLight')} />
                <ThemeButton theme="dark" current={currentTheme} onChange={onChangeTheme} icon={<MoonIcon className="w-6 h-6" />} label={t('themeDark')} />
                <ThemeButton theme="night" current={currentTheme} onChange={onChangeTheme} icon={<MoonIcon className="w-6 h-6" />} label={t('themeNight')} />
                <ThemeButton theme="dusk" current={currentTheme} onChange={onChangeTheme} icon={<MoonIcon className="w-6 h-6" />} label={t('themeDusk')} />
                <ThemeButton theme="forest" current={currentTheme} onChange={onChangeTheme} icon={<LeafIcon className="w-6 h-6" />} label={t('themeForest')} />
                <ThemeButton theme="ocean" current={currentTheme} onChange={onChangeTheme} icon={<WaveIcon className="w-6 h-6" />} label={t('themeOcean')} />
            </div>
          </div>
        </section>

        {/* AI Model Section */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <CpuIcon className="w-5 h-5" />
            {t('settingsModel')}
          </h2>
          <div className="bg-[var(--background-secondary)] p-4 rounded-lg">
            <label className="block text-md font-medium mb-3">{t('settingsModelSelect')}</label>
            <div className="space-y-2">
                <ModelButton 
                    model="gemini-2.5-flash" 
                    current={currentModel} 
                    onChange={onChangeModel}
                    label="Gemini Flash"
                    description={t('settingsModelFlashDesc')}
                />
                <ModelButton 
                    model="gemini-2.5-pro" 
                    current={currentModel} 
                    onChange={onChangeModel}
                    label="Gemini Pro"
                    description={t('settingsModelProDesc')}
                />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-4">
              {t('settingsModelInfo')}
            </p>
          </div>
        </section>

        {/* Language Section */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <TranslateIcon className="w-5 h-5" />
            {t('settingsLanguage')}
          </h2>
          <div className="relative bg-[var(--background-secondary)] rounded-lg">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-transparent font-medium focus:outline-none appearance-none p-4 rounded-lg"
              aria-label={t('settingsLanguage')}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-secondary)]">
                <ChevronDownIcon className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Data & Privacy Section */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <DataSaverIcon className="w-5 h-5" />
            {t('settingsData')}
          </h2>
          <div className="bg-[var(--background-secondary)] rounded-lg divide-y divide-[var(--border-color)]">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{t('settingsInternetSaving')}</p>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs">{t('settingsInternetSavingDesc')}</p>
              </div>
              <label htmlFor="internet-saving-toggle" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="internet-saving-toggle"
                  className="sr-only peer"
                  checked={isInternetSavingMode}
                  onChange={(e) => onSetInternetSavingMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--accent-primary)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
              </label>
            </div>
            <button onClick={handleClearData} className="w-full text-left p-4 hover:bg-[var(--background-tertiary)] rounded-b-lg">
              <p className="font-medium text-[var(--destructive)]">{t('settingsClearData')}</p>
              <p className="text-xs text-[var(--text-secondary)]">{t('settingsClearDataDesc')}</p>
            </button>
          </div>
        </section>

        {/* About & Support Section */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 flex items-center gap-2">
            <InfoIcon className="w-5 h-5" />
            {t('settingsAbout')}
          </h2>
          <div className="bg-[var(--background-secondary)] rounded-lg divide-y divide-[var(--border-color)]">
              <button onClick={handleSendFeedback} className={`w-full text-left p-4 hover:bg-[var(--background-tertiary)] flex justify-between items-center ${canInstallPWA ? 'rounded-t-lg' : 'rounded-lg'}`}>
                <div className="flex items-center gap-3">
                  <FeedbackIcon className="w-5 h-5" />
                  <span className="font-medium">{t('settingsSendFeedback')}</span>
                </div>
                <ChevronDownIcon className="w-5 h-5 transform -rotate-90" />
              </button>
              {canInstallPWA && (
                <button onClick={onInstallApp} className="w-full text-left p-4 hover:bg-[var(--background-tertiary)] flex justify-between items-center rounded-b-lg">
                  <div className="flex items-center gap-3">
                    <DownloadIcon className="w-5 h-5" />
                    <span className="font-medium">{t('settingsInstallApp')}</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 transform -rotate-90" />
                </button>
              )}
          </div>
        </section>
      </main>
    </div>
  );
};

interface ThemeButtonProps {
    theme: Theme;
    current: Theme;
    onChange: (theme: Theme) => void;
    icon: React.ReactNode;
    label: string;
}
  
const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, current, onChange, icon, label }) => {
    const { t } = useI18n();
    return (
      <button
        onClick={() => onChange(theme)}
        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
          current === theme
            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
            : 'border-transparent hover:bg-[var(--background-tertiary)]'
        } transition-all`}
        aria-label={`${t('setThemeTo')} ${label}`}
      >
        <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
};

// Fix: Add default export
export default Settings;