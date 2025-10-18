import type React from 'react';

import { SettingsFlyoutContainer } from './SettingsFlyoutContainer';
import { SettingsPanelContainer } from './SettingsPanelContainer';

export const SettingsToggle: React.FC = () => {
  return (
    <SettingsFlyoutContainer>
      <SettingsPanelContainer />
    </SettingsFlyoutContainer>
  );
};
