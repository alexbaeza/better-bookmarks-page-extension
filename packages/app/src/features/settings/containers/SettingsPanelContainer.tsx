import { Heart, Palette, Settings, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { LOCAL_STORAGE_PREFIX_KEY } from '@/config/constants';
import { useTranslation } from '@/i18n/hooks';
import { BuiltWith } from '@/shared/ui/BuiltWith';
import { Button } from '@/shared/ui/Button';
import { CollapsibleSection } from '@/shared/ui/CollapsibleSection';
import { Content } from '@/shared/ui/Content';
import { Modal } from '@/shared/ui/Modal';
import { Row } from '@/shared/ui/Row';
import { Sponsor } from '@/shared/ui/Sponsor';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
import { BackgroundOverlaySettings } from '../components/BackgroundOverlaySettings';
import { GreetingSettings } from '../components/GreetingSettings';
import { LanguageSettings } from '../components/LanguageSettings';
import { SearchBarSettings } from '../components/SearchBarSettings';
import { SidebarSettings } from '../components/SidebarSettings';
import { UnifiedThemeSettings } from '../components/UnifiedThemeSettings';
import { ZoomSettings } from '../components/ZoomSettings';

export const SettingsPanelContainer: React.FC = () => {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleResetAll = () => {
    // Clear app-specific localStorage keys only
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(LOCAL_STORAGE_PREFIX_KEY));
    for (const key of keys) {
      localStorage.removeItem(key);
    }
    // Force a reload so atoms rehydrate to defaults
    window.location.reload();
  };

  return (
    <>
      <Content>
        <Stack>
          {/* Personalization Section - Merged Layout and Personalization */}
          <CollapsibleSection
            dataTestId="personalization-section"
            defaultOpen={false}
            icon={<Settings size={16} />}
            title={t('settings.sections.personalization')}
          >
            <LanguageSettings dataTestId="language-settings" />
            <SidebarSettings dataTestId="sidebar-settings" />
            <SearchBarSettings dataTestId="search-bar-settings" />
            <GreetingSettings dataTestId="greeting-settings" />
            <ZoomSettings dataTestId="zoom-settings-flyout" />
          </CollapsibleSection>

          {/* Appearance Section - Grouped theme-related settings */}
          <CollapsibleSection
            dataTestId="appearance-section"
            defaultOpen={false}
            icon={<Palette size={16} />}
            title={t('settings.sections.appearance')}
          >
            <BackgroundOverlaySettings dataTestId="background-overlay-settings" />
            <UnifiedThemeSettings />
          </CollapsibleSection>

          {/* Maintenance */}
          <CollapsibleSection
            dataTestId="maintenance-section"
            defaultOpen={false}
            icon={<Trash2 size={16} />}
            title={t('settings.sections.maintenance')}
          >
            <Button
              aria-label={t('settings.reset.title')}
              className="w-full"
              data-testid="settings-reset-open-button"
              onClick={() => setIsConfirmOpen(true)}
              variant="secondary"
            >
              {t('common.actions.resetAllSettings')}
            </Button>
          </CollapsibleSection>
          {/* Support Section */}
          <CollapsibleSection
            dataTestId="support-section"
            icon={<Heart size={16} />}
            title={t('settings.sections.support')}
          >
            <Sponsor dataTestId="sponsor" />
          </CollapsibleSection>

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
          title={t('settings.reset.title')}
        >
          <Stack data-testid="confirmation-modal-container" gap="lg">
            <Text color="secondary" size="sm">
              {t('settings.reset.description')}
            </Text>
            <Row gap="sm" justifyContent="end">
              <Button
                data-testid="settings-reset-cancel-button"
                onClick={() => setIsConfirmOpen(false)}
                variant="secondary"
              >
                {t('common.buttons.cancel')}
              </Button>
              <Button data-testid="settings-reset-confirm-button" onClick={handleResetAll} variant="primary">
                {t('common.buttons.confirm')}
              </Button>
            </Row>
          </Stack>
        </Modal>
      )}
    </>
  );
};
