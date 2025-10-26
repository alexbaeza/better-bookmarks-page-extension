import type React from 'react';
import { useState } from 'react';
import { LOCAL_STORAGE_PREFIX_KEY } from '@/config/constants';
import { BuiltWith } from '@/shared/ui/BuiltWith';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { Modal } from '@/shared/ui/Modal';
import { Sponsor } from '@/shared/ui/Sponsor';
import { BackgroundOverlaySettings } from '../components/BackgroundOverlaySettings';
import { GreetingSettings } from '../components/GreetingSettings';
import { SearchBarSettings } from '../components/SearchBarSettings';
import { SidebarSettings } from '../components/SidebarSettings';
import { UnifiedThemeSettings } from '../components/UnifiedThemeSettings';
import { ZoomSettings } from '../components/ZoomSettings';

export const SettingsPanelContainer: React.FC = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleResetAll = () => {
    // Clear app-specific localStorage keys only
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(LOCAL_STORAGE_PREFIX_KEY));
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
          <Button
            aria-label="Reset all settings"
            className="w-full"
            data-testid="settings-reset-open-button"
            onClick={() => setIsConfirmOpen(true)}
            variant="secondary"
          >
            Reset all settings (clears local storage)
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <BuiltWith />
        </div>
      </div>
      {isConfirmOpen && (
        <Modal dataTestId="settings-reset-modal" onClose={() => setIsConfirmOpen(false)} size="md" title="Reset all settings">
          <div className="space-y-4" data-testid="confirmation-modal-container">
            <p className="text-sm text-fgColor-secondary">This will clear all saved preferences and reload the page. This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button data-testid="settings-reset-cancel-button" onClick={() => setIsConfirmOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button data-testid="settings-reset-confirm-button" onClick={handleResetAll} variant="primary">
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
