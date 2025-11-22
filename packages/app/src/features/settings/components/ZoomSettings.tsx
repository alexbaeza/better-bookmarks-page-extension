import type React from 'react';

import { useTranslation } from '@/i18n/hooks';
import { SettingItem } from '@/shared/ui/SettingItem';
import { ZoomControls } from '@/shared/ui/ZoomControls';

interface ZoomSettingsProps {
  dataTestId?: string;
}

export const ZoomSettings: React.FC<ZoomSettingsProps> = ({ dataTestId = 'zoom-settings' }) => {
  const { t } = useTranslation();
  return (
    <SettingItem dataTestId={dataTestId} label={t('settings.zoom.scale')}>
      <ZoomControls dataTestId={dataTestId} variant="settings" />
    </SettingItem>
  );
};
