import React, { useState } from 'react';
import { BackIcon, ImageIcon, DownloadIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import { generateImageFromPrompt } from '../services/geminiService';

interface ImageGeneratorProps {
  onBack: () => void;
  isOnline: boolean;
  isInternetSavingMode: boolean;
}

const PRE_GENERATED_LOGO_PROMPT = "Minimalist vector logo for an AI education app named 'Haile Edu Bot'. The design should feature a sleek, friendly, and intelligent robot mascot from the chest up. The robot is wearing a graduation cap. The style should be modern flat design, using a simple color palette of cyan blue, deep slate blue, and white. The logo needs to be clean, memorable, and easily recognizable as an app icon. White background.";
const PRE_GENERATED_LOGO_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUSEBIVFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQFS0dFR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAECBAUGBwj/xAA+EAABAwIEAwUFBgUDBQEAAAABAAIRAyEEEjFBBVFhInGBkQYTMqGxwfBCUtHhI2Jy8gckM4KSFhc0U2Oi/9/aAAwDAQACEQMRAD8A9xQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgB-';


const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onBack, isOnline, isInternetSavingMode }) => {
  const [prompt, setPrompt] = useState(PRE_GENERATED_LOGO_PROMPT);
  const [lastPrompt, setLastPrompt] = useState(PRE_GENERATED_LOGO_PROMPT);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(PRE_GENERATED_LOGO_BASE64);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setImageUrl(null);
    setError(null);
    setLastPrompt(prompt);

    try {
      const base64Image = await generateImageFromPrompt(prompt);
      setImageUrl(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      setError(t('imageGeneratorError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    setImageUrl(null);
    setError(null);
    setLastPrompt('');
    setPrompt('');
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('imageGeneratorHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-sm text-center">
          {imageUrl && !isInternetSavingMode ? (
            <div className="animate-fade-in-scale">
                <h2 className="text-2xl font-semibold mb-2">{t('imageGeneratorTitle')}</h2>
                <p className="text-[var(--text-secondary)] mb-6">{t('imageGeneratorSubtitle')}</p>
                <div className="relative group w-full aspect-square rounded-xl overflow-hidden mb-4 border-2 border-[var(--border-color)]">
                    <img src={imageUrl} alt={lastPrompt} className="w-full h-full object-cover" />
                    <a
                        href={imageUrl}
                        download={`haile-edu-bot-logo.jpeg`}
                        className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                        aria-label={t('imageGeneratorDownload')}
                    >
                        <DownloadIcon className="w-6 h-6" />
                    </a>
                </div>
                <p className="text-sm text-left bg-[var(--background-secondary)] p-3 rounded-md text-[var(--text-secondary)] mb-4 italic">"{lastPrompt}"</p>
                <button
                    onClick={handleGenerateAnother}
                    className="w-full bg-[var(--background-secondary)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg transition-all hover:bg-[var(--background-tertiary)]"
                >
                    {t('imageGeneratorGenerateAnother')}
                </button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-20 h-20 text-[var(--accent-primary)] mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-2">{t('imageGeneratorTitle')}</h2>
              <p className="text-[var(--text-secondary)] mb-8">{t('imageGeneratorSubtitle')}</p>
              
              {isInternetSavingMode ? (
                  <div className="bg-[var(--background-secondary)] p-4 rounded-lg text-center text-[var(--text-secondary)]">
                    <p className="font-medium mb-2">{t('internetSavingModeActive')}</p>
                    <p className="text-sm">{t('offlineImageGenerator')}</p>
                  </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('imageGeneratorPlaceholder')}
                    className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                    rows={4}
                    aria-label="Image Prompt"
                    disabled={isLoading || !isOnline}
                  />
                  {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading || !isOnline}
                    className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
                  >
                    {isLoading ? t('imageGeneratorGenerating') : t('imageGeneratorGenerate')}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ImageGenerator;