import React, { useState, useEffect } from 'react';
import { BackIcon, TranslateIcon, SwitchLanguagesIcon, CopyIcon, CheckIcon, ChevronDownIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import { translateText } from '../services/geminiService';
import type { Model } from '../types';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'am', name: 'Amharic' },
    { code: 'om', name: 'Oromo' },
    { code: 'ti', name: 'Tigrinya' },
    { code: 'bn', name: 'Bengali' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'el', name: 'Greek' },
    { code: 'fa', name: 'Persian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hu', name: 'Hungarian' },
  ];
  
const sourceLanguages = [{ code: 'auto', name: 'Detect Language' }, ...languages];
const targetLanguages = languages;

const TranslationScreen: React.FC<{ onBack: () => void; model: Model }> = ({ onBack, model }) => {
  const { t, language } = useI18n();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState(language);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // If the user's interface language is not in our list, default to English.
    if (!targetLanguages.some(lang => lang.code === language)) {
      setTargetLang('en');
    } else {
      setTargetLang(language);
    }
  }, [language]);


  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setOutputText('');
    setError('');

    try {
      const translation = await translateText(model, inputText, sourceLang, targetLang);
      setOutputText(translation);
    } catch (err) {
      setError(t('translationError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return; // Cannot swap 'auto' to be a target language
    setInputText(outputText);
    setOutputText('');
    const currentSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(currentSource);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('translationHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 flex flex-col">
        <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-4">
                <LanguageSelector label={t('translateFrom')} languages={sourceLanguages} value={sourceLang} onChange={setSourceLang} />
                <button onClick={handleSwapLanguages} disabled={sourceLang === 'auto'} className="p-2 rounded-full hover:bg-[var(--background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t('swapLanguages')}>
                    <SwitchLanguagesIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
                <LanguageSelector label={t('translateTo')} languages={targetLanguages} value={targetLang} onChange={setTargetLang} />
            </div>

            <div className="space-y-4">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('enterTextToTranslate')}
                    className="w-full h-32 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                    aria-label={t('enterTextToTranslate')}
                />
                <div className="relative">
                    <textarea
                        value={isLoading ? t('translating') : outputText}
                        readOnly
                        placeholder={isLoading ? '' : 'Translation'}
                        className="w-full h-32 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none"
                        aria-label="Translated text"
                    />
                    {outputText && !isLoading && (
                         <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]" aria-label={t('copyTranslation')}>
                           {isCopied ? <CheckIcon className="w-5 h-5 text-[var(--accent-primary)]" /> : <CopyIcon className="w-5 h-5" />}
                         </button>
                    )}
                </div>
                 {error && <p className="text-sm text-center text-[var(--destructive)]">{error}</p>}
            </div>
        </div>

        <div className="mt-6">
            <button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isLoading}
                className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
            >
                {isLoading ? t('translating') : t('translateButton')}
            </button>
        </div>
      </main>
    </div>
  );
};

interface LanguageSelectorProps {
    label: string;
    languages: { code: string; name: string }[];
    value: string;
    onChange: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, languages, value, onChange }) => {
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-md py-2 pl-3 pr-8 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] appearance-none text-sm"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name === 'Detect Language' ? 'Auto Detect' : lang.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)]">
                    <ChevronDownIcon className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};


export default TranslationScreen;