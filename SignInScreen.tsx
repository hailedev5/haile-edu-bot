import React, { useState } from 'react';
import { RobotIcon, GoogleIcon, FacebookIcon, TelegramIcon, InstagramIcon, TikTokIcon, UserCircleIcon, XIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import type { LinkedAccount, AuthProvider } from '../types';

interface SignInScreenProps {
  onSignIn: (account: LinkedAccount) => void;
}

const backgroundImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEA8QDxAQEBAQEA8PEBAPEA8QDw8PFRIWFhUSExMYHSggGBolGxMVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQFS0dFR0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABgECBAUHAwj/xABEEAACAQMCAwUGAwUGBQUAAAABAgADBBESIQUxQVEGEyJhcYEHkaEUMkJScrHBI2KC0VOCorLC8PEkMzVTc5PS4v/EABoBAQEAAwEBAAAAAAAAAAAAAAABAgMEBQb/xAAqEQEAAgIBAwIFAwUAAAAAAAAAAQIDEQQSITFBBSJREzJhcYGhI0Kxwf/AAwDAQACEQMRAD8A9xREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQ-D/2-A.jpg';

const mockGoogleAccounts: LinkedAccount[] = [
    { provider: 'google', id: 'alex.doe@gmail.com', displayName: 'Alex Doe', picture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0FBQUFBQSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTIuM2MtMi41IDAtNC43LTEuMjgtNi0zLjIzLjAyLTIgNC0zLjEgNi0zLjEgMS45OSAwIDUuOTggMS4xIDYgMy4yMy0xLjM0IDIuMDEtMy41MiAzLTIzLTYgMy4yM3oiLz48L3N2Zz4=' },
    { provider: 'google', id: 'jane.smith@gmail.com', displayName: 'Jane Smith', picture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzc4OTBFQiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTIuM2MtMi41IDAtNC43LTEuMjgtNi0zLjIzLjAyLTIgNC0zLjEgNi0zLjEgMS45OSAwIDUuOTggMS4xIDYgMy4yMy0xLjM0IDIuMDEtMy41MiAzLTIzLTYgMy4yM3oiLz48L3N2Zz4=' },
];
const mockFacebookAccounts: LinkedAccount[] = [
    { provider: 'facebook', id: 'john.appleseed', displayName: 'John Appleseed', picture: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRGQjRGRCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTIuM2MtMi41IDAtNC43LTEuMjgtNi0zLjIzLjAyLTIgNC0zLjEgNi0zLjEgMS45OSAwIDUuOTggMS4xIDYgMy4yMy0xLjM0IDIuMDEtMy41MiAzLTIzLTYgMy4yM3oiLz48L3N2Zz4=' }
];
const mockSingleAccount: LinkedAccount = { provider: 'telegram', id: 'user123', displayName: 'User 123', picture: undefined };

const SocialButton: React.FC<{onClick: () => void; icon: React.ReactNode; label: string}> = ({ onClick, icon, label }) => {
    const { t } = useI18n();
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-4 bg-[var(--background-secondary)]/60 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--background-tertiary)] transition-colors"
        >
            {icon}
            <span>{t('continueWith')} {label}</span>
        </button>
    )
};


const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const { t } = useI18n();
  const [pickerState, setPickerState] = useState<{isVisible: boolean; provider: AuthProvider | null}>({isVisible: false, provider: null});
  const [showTikTokInput, setShowTikTokInput] = useState(false);

  const getMockAccounts = (provider: AuthProvider): LinkedAccount[] => {
    switch(provider) {
        case 'google': return mockGoogleAccounts;
        case 'facebook': return mockFacebookAccounts;
        case 'telegram': return [{...mockSingleAccount, provider: 'telegram'}];
        case 'instagram': return [{...mockSingleAccount, provider: 'instagram', displayName: 'InstaUser'}];
        case 'tiktok': return [{...mockSingleAccount, provider: 'tiktok', displayName: 'TikToker'}];
        default: return [];
    }
  }

  const handleSocialClick = (provider: AuthProvider) => {
    if (provider === 'telegram') {
      window.open('https://t.me/BotsBusinessAdminBot', '_blank');
      // Simulate sign-in after redirecting to the bot
      onSignIn({ provider: 'telegram', id: 'user123', displayName: 'User 123' });
      return;
    }

    if (provider === 'tiktok') {
      setShowTikTokInput(true);
      return;
    }

    setPickerState({ isVisible: true, provider });
  };

  const handleTikTokSignIn = (username: string) => {
    if (username.trim()) {
        onSignIn({
            provider: 'tiktok',
            id: username.trim(),
            displayName: username.trim()
        });
        setShowTikTokInput(false);
    }
  };
  
  const handleSelectAccount = (account: LinkedAccount) => {
    onSignIn(account);
    setPickerState({ isVisible: false, provider: null });
  };

  return (
    <>
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col justify-between p-8 text-[var(--text-primary)] font-['Poppins']"
      style={{
        backgroundImage: `linear-gradient(to top, var(--background-primary) 20%, rgba(15, 23, 42, 0.6)), url(${backgroundImage})`,
      }}
    >
      <header className="flex items-center gap-3 opacity-90">
        <RobotIcon className="w-9 h-9" />
        <div>
          <h1 className="text-base font-bold tracking-wider">{t('haile')}</h1>
          <p className="text-xs text-[var(--accent-primary)]">{t('appSlogan')}</p>
        </div>
      </header>
      
      <main className="flex flex-col items-center text-center -mt-10 md:-mt-20">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl w-full max-w-sm">
          <h2 className="text-4xl font-bold mb-3 tracking-wide">{t('signInTitle1')}</h2>
          <h2 className="text-4xl font-bold mb-6 tracking-wide text-[var(--accent-primary)]">{t('signInTitle2')}</h2>
          <p className="text-base text-gray-300 max-w-md mb-8">
            {t('signInSubtitle')}
          </p>
          <div className="space-y-3">
            <SocialButton onClick={() => handleSocialClick('google')} icon={<GoogleIcon className="w-6 h-6" />} label={t('google')} />
            <SocialButton onClick={() => handleSocialClick('facebook')} icon={<FacebookIcon className="w-6 h-6" />} label={t('facebook')} />
            <SocialButton onClick={() => handleSocialClick('instagram')} icon={<InstagramIcon className="w-6 h-6" />} label={t('instagram')} />
            <SocialButton onClick={() => handleSocialClick('tiktok')} icon={<TikTokIcon className="w-6 h-6" />} label={t('tiktok')} />
            <SocialButton onClick={() => handleSocialClick('telegram')} icon={<TelegramIcon className="w-6 h-6" />} label={t('telegram')} />
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 pb-2">
        <p>{t('copyright')}</p>
      </footer>
    </div>
    {pickerState.isVisible && pickerState.provider && (
        <AccountPicker 
            accounts={getMockAccounts(pickerState.provider)}
            onSelect={handleSelectAccount}
            onClose={() => setPickerState({ isVisible: false, provider: null })}
            providerName={t(pickerState.provider)}
        />
    )}
    {showTikTokInput && (
        <TikTokSignInModal
            onClose={() => setShowTikTokInput(false)}
            onConnect={handleTikTokSignIn}
        />
    )}
    </>
  );
};

interface AccountPickerProps {
    accounts: LinkedAccount[];
    onSelect: (account: LinkedAccount) => void;
    onClose: () => void;
    providerName: string;
}

const AccountPicker: React.FC<AccountPickerProps> = ({ accounts, onSelect, onClose, providerName }) => {
    const { t } = useI18n();
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-[var(--background-secondary)] rounded-2xl shadow-2xl w-full max-w-sm m-4 animate-fade-in-scale" 
                style={{animationDuration: '0.2s'}}
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">{t('signInTitle2')}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{t('continueWith')} {providerName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-2 max-h-80 overflow-y-auto">
                    {accounts.map(account => (
                        <button key={account.id} onClick={() => onSelect(account)} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--background-tertiary)] transition-colors text-left">
                            {account.picture ? (
                                <img src={account.picture} alt={account.displayName} className="w-10 h-10 rounded-full" />
                            ) : (
                                <UserCircleIcon className="w-10 h-10 text-[var(--text-secondary)]" />
                            )}
                            <div>
                                <p className="font-semibold text-sm">{account.displayName}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{account.id}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface TikTokSignInModalProps {
    onClose: () => void;
    onConnect: (username: string) => void;
}

const TikTokSignInModal: React.FC<TikTokSignInModalProps> = ({ onClose, onConnect }) => {
    const [username, setUsername] = useState('');
    const { t } = useI18n();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect(username);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-[var(--background-secondary)] rounded-2xl shadow-2xl w-full max-w-sm m-4 p-6 animate-fade-in-scale"
                style={{animationDuration: '0.2s'}}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <TikTokIcon className="w-6 h-6" />
                        <h3 className="font-bold text-lg">{`${t('continueWith')} TikTok`}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="tiktok-username" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        {t('tiktokUsernameLabel')}
                    </label>
                    <input
                        id="tiktok-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t('tiktokUsernamePlaceholder')}
                        className="w-full bg-[var(--background-tertiary)] border border-[var(--border-color)] rounded-lg py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="w-full mt-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold py-3 px-4 rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] transition-all disabled:opacity-50"
                    >
                        {t('tiktokConnectButton')}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default SignInScreen;