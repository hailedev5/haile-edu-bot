import React, { useState, useRef, useEffect } from 'react';
import { BackIcon, UserCircleIcon, SignOutIcon, CameraIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import type { UserProfile } from '../types';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onBack: () => void;
  onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile, onBack, onSignOut }) => {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If the profile from props changes (e.g., initial load), update the temp state
    setTempProfile(userProfile);
  }, [userProfile]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling, revert to original profile
      setTempProfile(userProfile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    setIsEditing(false);
  };
  
  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile(prev => ({ ...prev, picture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('profileHeader')}</h1>
      </header>
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="mt-8 flex flex-col items-center text-center w-full">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePictureChange}
                accept="image/*"
                capture="user"
                style={{ display: 'none' }}
            />
          <div className="relative group animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            {tempProfile.picture ? (
                 <img src={tempProfile.picture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-[var(--background-tertiary)] shadow-lg" />
            ) : (
                <UserCircleIcon className="w-32 h-32 text-[var(--text-secondary)]" />
            )}
            {isEditing && (
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={t('profileChangePhoto')}
                >
                    <CameraIcon className="w-8 h-8"/>
                 </button>
            )}
          </div>

          {isEditing ? (
            <div className="w-full mt-6 space-y-4 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                <div>
                    <label htmlFor="name" className="text-sm text-left block font-medium text-[var(--text-secondary)] mb-1">{t('profileNameLabel')}</label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        value={tempProfile.name}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="text-sm text-left block font-medium text-[var(--text-secondary)] mb-1">{t('profileEmailLabel')}</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={tempProfile.email}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                </div>
            </div>
          ) : (
            <>
                <h2 className="text-2xl font-bold mt-4 animate-slide-in-up" style={{ animationDelay: '200ms' }}>{userProfile.name}</h2>
                <p className="text-[var(--text-secondary)] mt-1 animate-slide-in-up" style={{ animationDelay: '300ms' }}>{userProfile.email}</p>
            </>
          )}

        </div>
        <div className="w-full mt-auto mb-4 space-y-3">
        {isEditing ? (
            <div className="flex gap-3 animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                <button
                    onClick={handleEditToggle}
                    className="w-full bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--background-tertiary)] transition-colors"
                >
                    {t('profileCancel')}
                </button>
                <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold py-3 px-4 rounded-lg hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] transition-all"
                >
                    {t('profileSave')}
                </button>
            </div>
          ) : (
             <button
                onClick={handleEditToggle}
                className="w-full bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold py-3 px-4 rounded-lg hover:bg-[var(--background-tertiary)] transition-colors animate-slide-in-up" style={{ animationDelay: '400ms' }}
            >
                {t('profileEdit')}
            </button>
          )}
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-3 bg-[var(--destructive-background)] border border-[var(--destructive-border)] text-[var(--destructive)] font-semibold py-3 px-4 rounded-lg hover:bg-red-600/30 transition-colors animate-slide-in-up"
             style={{ animationDelay: '500ms' }}
          >
            <SignOutIcon className="w-5 h-5" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;