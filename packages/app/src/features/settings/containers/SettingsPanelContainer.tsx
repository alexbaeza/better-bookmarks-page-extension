import type React from 'react';
import { useState } from 'react';
import { LOCAL_STORAGE_PREFIX_KEY } from '@/config/constants';
import { BuiltWith } from '@/shared/ui/BuiltWith';
import { Button } from '@/shared/ui/Button';
import { Content } from '@/shared/ui/Content';
import { Divider } from '@/shared/ui/Divider';
import { Modal } from '@/shared/ui/Modal';
import { Row } from '@/shared/ui/Row';
import { Scrollable } from '@/shared/ui/Scrollable';
import { Sponsor } from '@/shared/ui/Sponsor';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
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
    <Scrollable className="h-full">
      <Content padding>
        <Stack gap="lg">
          {/* Layout Section */}
          <Stack gap="md">
            <Divider title="Layout" />
            <SidebarSettings dataTestId="sidebar-settings" />
            <SearchBarSettings dataTestId="search-bar-settings" />
          </Stack>

          {/* Personalization Section */}
          <Stack gap="md">
            <Divider title="Personalization" />
            <GreetingSettings dataTestId="greeting-settings" />
          </Stack>

          {/* Appearance Section */}
          <Stack gap="md">
            <Divider title="Appearance" />
            <ZoomSettings dataTestId="zoom-settings-flyout" />
            <UnifiedThemeSettings />
            <BackgroundOverlaySettings dataTestId="background-overlay-settings" />
          </Stack>

          {/* Support Section */}
          <Stack gap="md">
            <Divider title="Support" />
            <Sponsor dataTestId="sponsor" />
          </Stack>

          {/* Maintenance */}
          <Stack gap="md">
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
          </Stack>

          {/* Footer */}
          <div className="pt-2">
            <BuiltWith />
          </div>
        </Stack>
      </Content>
      {isConfirmOpen && (
        <Modal
          dataTestId="settings-reset-modal"
          onClose={() => setIsConfirmOpen(false)}
          size="md"
          title="Reset all settings"
        >
          <Stack data-testid="confirmation-modal-container" gap="lg">
            <Text color="secondary" size="sm">
              This will clear all saved preferences and reload the page. This action cannot be undone.
            </Text>
            <Row gap="sm" justifyContent="end">
              <Button
                data-testid="settings-reset-cancel-button"
                onClick={() => setIsConfirmOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button data-testid="settings-reset-confirm-button" onClick={handleResetAll} variant="primary">
                Confirm
              </Button>
            </Row>
          </Stack>
        </Modal>
      )}
    </Scrollable>
  );
};
