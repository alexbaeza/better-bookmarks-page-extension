import { Settings, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { useTranslation } from '@/i18n/hooks';
import { Flyout } from '@/shared/ui/Flyout';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';

interface SettingsFlyoutContainerProps {
  children: React.ReactNode;
}

export const SettingsFlyoutContainer: React.FC<SettingsFlyoutContainerProps> = ({ children }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleFlyout = () => setIsOpen(!isOpen);
  const closeFlyout = () => setIsOpen(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <IconButton
          aria-label={t('settings.title')}
          className="shadow-lg"
          dataTestId="settings-toggle"
          icon={<Settings size={24} />}
          onClick={toggleFlyout}
          size="lg"
        />
      </div>

      <Flyout data-testid="settings-modal" isOpen={isOpen} onClose={closeFlyout} side="right" widthClass="w-[28rem]">
        <div className="flex items-center justify-between border-b border-fgColor-secondary/20 p-4">
          <Text as="h2" color="primary" size="xl" weight="semibold">
            {t('settings.title')}
          </Text>
          <IconButton dataTestId="modal-close-button" icon={<X size={16} />} onClick={closeFlyout} />
        </div>
        <div className="flex-1 overflow-y-auto p-4" style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </Flyout>
    </>
  );
};
