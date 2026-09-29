import React, { useState, useEffect } from 'react';
import { BackIcon, BookIcon, SlidersIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import type { BookPreferences } from '../types';

interface BooksScreenProps {
  onBack: () => void;
  onStartBookGeneration: (topic: string, prefs: BookPreferences) => void;
}

const DEFAULT_PREFERENCES: BookPreferences = {
  tone: 'Informal',
  length: '10',
  audience: 'Beginner',
};

const BooksScreen: React.FC<BooksScreenProps> = ({ onBack, onStartBookGeneration }) => {
  const [topic, setTopic] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<BookPreferences>(DEFAULT_PREFERENCES);
  const { t } = useI18n();
  
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('bookPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error("Failed to load book preferences:", e);
    }
  }, []);

  const handlePreferencesSave = (newPrefs: BookPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem('bookPreferences', JSON.stringify(newPrefs));
    setShowPreferences(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartBookGeneration(topic.trim(), preferences);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('booksHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <BookIcon className="w-20 h-20 text-[var(--accent-primary)] mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-2">{t('booksTitle')}</h2>
          <p className="text-[var(--text-secondary)] mb-8">{t('booksSubtitle')}</p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('booksPlaceholder')}
                  className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-3 pl-4 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  aria-label="Book Topic"
                />
                 <button type="button" onClick={() => setShowPreferences(true)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label={t('preferences')}>
                    <SlidersIcon className="w-5 h-5" />
                 </button>
            </div>
            <button
              type="submit"
              disabled={!topic.trim()}
              className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
            >
              {t('booksGenerate')}
            </button>
          </form>
        </div>
      </main>
      {showPreferences && (
        <PreferencesModal 
            currentPreferences={preferences}
            onSave={handlePreferencesSave}
            onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
};


interface PreferencesModalProps {
    currentPreferences: BookPreferences;
    onSave: (prefs: BookPreferences) => void;
    onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ currentPreferences, onSave, onClose }) => {
    const [tempPrefs, setTempPrefs] = useState(currentPreferences);
    const { t } = useI18n();

    const handleSave = () => {
        onSave(tempPrefs);
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-scale" style={{animationDuration: '0.3s'}} onClick={onClose}>
            <div className="bg-[var(--background-secondary)] rounded-2xl shadow-lg w-full max-w-sm m-4 p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6 text-center">{t('preferencesHeader')}</h3>
                
                <div className="space-y-6">
                    {/* Tone */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('prefTone')}</label>
                        <div className="grid grid-cols-3 gap-2">
                           <PrefButton value="Formal" current={tempPrefs.tone} label={t('prefToneFormal')} onClick={() => setTempPrefs(p => ({...p, tone: 'Formal'}))} />
                           <PrefButton value="Informal" current={tempPrefs.tone} label={t('prefToneInformal')} onClick={() => setTempPrefs(p => ({...p, tone: 'Informal'}))} />
                           <PrefButton value="Humorous" current={tempPrefs.tone} label={t('prefToneHumorous')} onClick={() => setTempPrefs(p => ({...p, tone: 'Humorous'}))} />
                        </div>
                    </div>
                    {/* Length */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('prefLength')}</label>
                         <div className="space-y-2">
                           <PrefButton value="5" current={tempPrefs.length} label={t('prefLengthShort')} onClick={() => setTempPrefs(p => ({...p, length: '5'}))} fullWidth />
                           <PrefButton value="10" current={tempPrefs.length} label={t('prefLengthMedium')} onClick={() => setTempPrefs(p => ({...p, length: '10'}))} fullWidth />
                           <PrefButton value="15" current={tempPrefs.length} label={t('prefLengthLong')} onClick={() => setTempPrefs(p => ({...p, length: '15'}))} fullWidth />
                        </div>
                    </div>
                     {/* Audience */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('prefAudience')}</label>
                        <div className="grid grid-cols-3 gap-2">
                           <PrefButton value="Beginner" current={tempPrefs.audience} label={t('prefAudienceBeginner')} onClick={() => setTempPrefs(p => ({...p, audience: 'Beginner'}))} />
                           <PrefButton value="Intermediate" current={tempPrefs.audience} label={t('prefAudienceIntermediate')} onClick={() => setTempPrefs(p => ({...p, audience: 'Intermediate'}))} />
                           <PrefButton value="Expert" current={tempPrefs.audience} label={t('prefAudienceExpert')} onClick={() => setTempPrefs(p => ({...p, audience: 'Expert'}))} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button onClick={onClose} className="w-full bg-[var(--background-tertiary)] text-[var(--text-primary)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--border-color)] transition-colors">
                        {t('cancel')}
                    </button>
                    <button onClick={handleSave} className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold py-3 px-4 rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] transition-all">
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface PrefButtonProps {
    value: string;
    current: string;
    label: string;
    onClick: () => void;
    fullWidth?: boolean;
}
const PrefButton: React.FC<PrefButtonProps> = ({ value, current, label, onClick, fullWidth }) => {
    const isSelected = value === current;
    return (
        <button
            onClick={onClick}
            className={`p-3 rounded-md text-sm font-medium border-2 transition-all ${fullWidth ? 'w-full text-left' : 'text-center'} ${
                isSelected 
                ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                : 'bg-[var(--background-tertiary)] border-transparent hover:border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
        >
            {label}
        </button>
    )
}

export default BooksScreen;