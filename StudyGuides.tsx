import React, { useState } from 'react';
import { BackIcon, StudyGuideIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface StudyGuidesProps {
  onBack: () => void;
  onStartStudyGuide: (topic: string) => void;
}

const StudyGuides: React.FC<StudyGuidesProps> = ({ onBack, onStartStudyGuide }) => {
  const [topic, setTopic] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartStudyGuide(topic.trim());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('studyGuidesHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <StudyGuideIcon className="w-20 h-20 text-[var(--accent-primary)] mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-2">{t('studyGuidesTitle')}</h2>
          <p className="text-[var(--text-secondary)] mb-8">{t('studyGuidesSubtitle')}</p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('studyGuidesPlaceholder')}
              className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              aria-label="Study Guide Topic"
            />
            <button
              type="submit"
              disabled={!topic.trim()}
              className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
            >
              {t('studyGuidesGenerate')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default StudyGuides;