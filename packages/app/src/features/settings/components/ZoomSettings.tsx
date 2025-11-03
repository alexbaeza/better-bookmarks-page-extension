import type React from 'react';

import { ZoomControls } from '@/shared/ui/ZoomControls';

interface ZoomSettingsProps {
  dataTestId?: string;
}

export const ZoomSettings: React.FC<ZoomSettingsProps> = ({ dataTestId = 'zoom-settings' }) => {
  return <ZoomControls dataTestId={dataTestId} variant="settings" />;
};
