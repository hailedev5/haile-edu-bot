import React from 'react';
import { useI18n } from '../contexts/i18nContext';

const OfflineIndicator: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="bg-[var(--destructive)] text-white text-center py-2 text-sm font-semibold sticky top-0 z-50">
      {t('offlineMessage')}
    </div>
  );
};

export default OfflineIndicator;
