import React, { useState, useEffect } from 'react';
import { BackIcon, CopyIcon, XTwitterIcon, WhatsappIcon, FacebookIcon, TelegramIcon, EmailIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface ShareScreenProps {
  onBack: () => void;
}

const PRE_GENERATED_LOGO_BASE64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUSEBIVFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQFS0dFR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAAECBAUGBwj/xAA+EAABAwIEAwUFBgUDBQEAAAABAAIRAyEEEjFBBVFhInGBkQYTMqGxwfBCUtHhI2Jy8gckM4KSFhc0U2Oi/9/aAAwDAQACEQMRAD8A9xQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgB-';


const ShareScreen: React.FC<ShareScreenProps> = ({ onBack }) => {
  const { t } = useI18n();
  const [appUrl, setAppUrl] = useState('');
  const [copyText, setCopyText] = useState(t('shareCopyLink'));

  useEffect(() => {
    // Ensure this runs only on the client-side
    setAppUrl(window.location.origin);
  }, []);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl).then(() => {
        setCopyText(t('shareCopied'));
        setTimeout(() => setCopyText(t('shareCopyLink')), 2000);
      });
    }
  };

  const shareText = t('shareMessage');
  const encodedUrl = encodeURIComponent(appUrl);
  const encodedText = encodeURIComponent(shareText);
  const emailSubject = encodeURIComponent(t('shareEmailSubject'));
  const emailBody = encodeURIComponent(t('shareEmailBody').replace('{appUrl}', appUrl));

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('shareHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-[var(--background-secondary)] p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-2">{t('shareTitle')}</h2>
          <p className="text-[var(--text-secondary)] mb-6">{t('shareSubtitle')}</p>
          
          <div className="inline-block mb-6 p-2 bg-white rounded-2xl">
              <img 
                src={PRE_GENERATED_LOGO_BASE64} 
                alt="Haile Edu Bot Logo"
                className="w-40 h-40 rounded-xl"
              />
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--border-color)] transition-colors"
          >
            <CopyIcon className="w-5 h-5" />
            <span>{copyText}</span>
          </button>
        </div>

        <div className="mt-8 w-full max-w-sm">
             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[var(--border-color)]"></div>
                <span className="flex-shrink mx-4 text-[var(--text-secondary)] text-sm">{t('shareViaSocial')}</span>
                <div className="flex-grow border-t border-[var(--border-color)]"></div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
                <SocialShareButton href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} Icon={WhatsappIcon} label="WhatsApp" />
                <SocialShareButton href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} Icon={XTwitterIcon} label="X" />
                <SocialShareButton href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} Icon={FacebookIcon} label="Facebook" />
                <SocialShareButton href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} Icon={TelegramIcon} label="Telegram" />
                <SocialShareButton href={`mailto:?subject=${emailSubject}&body=${emailBody}`} Icon={EmailIcon} label="Email" />
            </div>
        </div>
      </main>
    </div>
  );
};

const SocialShareButton: React.FC<{ href: string, Icon: React.FC<{className?: string}>, label: string }> = ({ href, Icon, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${label}`}
       className="w-14 h-14 flex items-center justify-center bg-[var(--background-secondary)] rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--background-tertiary)] transition-all transform hover:scale-110">
        <Icon className="w-7 h-7" />
    </a>
);


export default ShareScreen;