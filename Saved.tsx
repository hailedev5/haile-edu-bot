import React, { useState, useEffect } from 'react';
import { BackIcon, BookmarkIcon, TrashIcon } from './Icons';
import type { SavedMessage } from '../types';
import { useI18n } from '../contexts/i18nContext';

interface SavedProps {
  onBack: () => void;
}

const Saved: React.FC<SavedProps> = ({ onBack }) => {
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const { t, language } = useI18n();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedMessages') || '[]') as SavedMessage[];
    saved.sort((a, b) => b.savedAt - a.savedAt);
    setSavedMessages(saved);
  }, []);
  
  const handleUnsave = (messageId: string) => {
    const updatedSaved = savedMessages.filter(m => m.id !== messageId);
    setSavedMessages(updatedSaved);
    localStorage.setItem('savedMessages', JSON.stringify(updatedSaved));
  };

  const formatDate = (timestamp: number) => {
    try {
        return new Date(timestamp).toLocaleDateString(language);
    } catch (e) {
        console.warn(`Could not format date for locale "${language}", falling back to default.`);
        return new Date(timestamp).toLocaleDateString();
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('savedHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        {savedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
            <BookmarkIcon className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold">{t('savedEmptyTitle')}</h2>
            <p className="text-center mt-2">{t('savedEmptySubtitle')}</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {savedMessages.map((message) => (
              <div key={message.id} className="group bg-[var(--background-secondary)] p-4 rounded-lg">
                <div 
                    className="prose prose-sm prose-p:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-headings:text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }}
                />
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--border-color)]/50">
                     <p className="text-xs text-[var(--text-secondary)]">
                        {t('savedOn')} {formatDate(message.savedAt)}
                    </p>
                    <button 
                        onClick={() => handleUnsave(message.id)} 
                        className="p-2 rounded-full hover:bg-[var(--destructive-background)] text-[var(--text-secondary)] hover:text-[var(--destructive)] opacity-0 group-hover:opacity-100 transition-all"
                        aria-label={t('unsaveMessage')}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Saved;