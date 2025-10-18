import type React from 'react';

import { AppFooter } from '@/shared/ui/AppFooter';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { Sponsor } from '@/shared/ui/Sponsor';

import { BackgroundOverlaySettings } from '../components/BackgroundOverlaySettings';
import { GreetingSettings } from '../components/GreetingSettings';
import { SearchBarSettings } from '../components/SearchBarSettings';
import { SidebarSettings } from '../components/SidebarSettings';
import { UnifiedThemeSettings } from '../components/UnifiedThemeSettings';
import { ZoomSettings } from '../components/ZoomSettings';

export const SettingsPanelContainer: React.FC = () => {
  const handleResetAll = () => {
    // Clear app-specific localStorage keys only
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('bb-'));
    for (const k of keys) {
      localStorage.removeItem(k);
    }
    // Force a reload so atoms rehydrate to defaults
    window.location.reload();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-4 p-4">
        {/* Layout Section */}
        <div className="space-y-3">
          <Divider title="Layout" />
          <SidebarSettings dataTestId="sidebar-settings" />
          <SearchBarSettings dataTestId="search-bar-settings" />
        </div>

        {/* Personalization Section */}
        <div className="space-y-3">
          <Divider title="Personalization" />
          <GreetingSettings dataTestId="greeting-settings" />
        </div>

        {/* Appearance Section */}
        <div className="space-y-3">
          <Divider title="Appearance" />
          <ZoomSettings dataTestId="zoom-settings-flyout" />
          <UnifiedThemeSettings />
          <BackgroundOverlaySettings dataTestId="background-overlay-settings" />
        </div>

        {/* Support Section */}
        <div className="space-y-3">
          <Divider title="Support" />
          <Sponsor dataTestId="sponsor" />
        </div>

        {/* Maintenance */}
        <div className="space-y-3">
          <Divider title="Maintenance" />
          <Button variant="secondary" className="w-full" onClick={handleResetAll} aria-label="Reset all settings">
            Reset all settings (clears local storage)
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <AppFooter />
        </div>
      </div>
    </div>
  );
};
