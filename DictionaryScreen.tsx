import React, { useState } from 'react';
import { BackIcon, DictionaryIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import { getWordDefinition } from '../services/geminiService';
import type { DictionaryEntry, Model } from '../types';

const DictionaryScreen: React.FC<{ onBack: () => void; model: Model }> = ({ onBack, model }) => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const definition = await getWordDefinition(model, word.trim().toLowerCase());
      setResult(definition);
    } catch (err) {
      setError(t('dictionaryError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setWord('');
    setResult(null);
    setError('');
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('dictionaryHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full text-center">
          
          {!result && !isLoading && (
             <div className="animate-slide-in-up">
                <DictionaryIcon className="w-20 h-20 text-[var(--accent-primary)] mx-auto mb-6" />
                <h2 className="text-2xl font-semibold mb-2">{t('dictionaryTitle')}</h2>
                <p className="text-[var(--text-secondary)] mb-8">{t('dictionarySubtitle')}</p>
             </div>
          )}

          {!result && (
            <form onSubmit={handleSubmit} className="w-full space-y-4 text-left animate-slide-in-up">
              <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder={t('dictionaryPlaceholder')}
                  className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  aria-label={t('dictionaryPlaceholder')}
                />
              <button
                type="submit"
                disabled={!word.trim() || isLoading}
                className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
              >
                {isLoading ? t('dictionarySearching') : t('dictionarySearchButton')}
              </button>
            </form>
          )}

          {isLoading && (
            <div className="text-center py-10">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-pulse"></span>
              </div>
              <p className="mt-4 text-[var(--text-secondary)]">{t('dictionarySearching')}</p>
            </div>
          )}
          
          {error && !isLoading && <p className="text-sm text-[var(--destructive)] mt-4">{error}</p>}

          {result && !isLoading && (
            <div className="mt-2 text-left animate-slide-in-up">
              <div className="bg-[var(--background-secondary)] p-4 rounded-lg space-y-4">
                <div>
                    <h2 className="text-3xl font-bold capitalize text-[var(--text-primary)]">{result.word}</h2>
                    <p className="text-[var(--accent-primary)]">{result.phonetic}</p>
                </div>
                {result.meanings.map((meaning, index) => (
                    <div key={index} className="pt-4 border-t border-[var(--border-color)]">
                        <h3 className="text-lg font-semibold italic text-[var(--text-secondary)]">{meaning.partOfSpeech}</h3>
                        <ol className="list-decimal list-inside mt-2 space-y-3">
                           {meaning.definitions.map((def, defIndex) => (
                             <li key={defIndex} className="text-[var(--text-primary)]">
                                {def.definition}
                                {def.example && (
                                    <p className="text-sm text-[var(--text-secondary)] italic mt-1 ml-4">"{def.example}"</p>
                                )}
                             </li>
                           ))}
                        </ol>
                    </div>
                ))}
              </div>
              <button
                onClick={handleReset}
                className="w-full mt-6 bg-[var(--background-secondary)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg transition-all hover:bg-[var(--background-tertiary)]"
              >
                {t('dictionaryAnotherButton')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DictionaryScreen;