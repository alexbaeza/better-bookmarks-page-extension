import { CogIcon, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Flyout } from '@/shared/ui/Flyout';
import { IconButton } from '@/shared/ui/IconButton';

interface SettingsFlyoutContainerProps {
  children: React.ReactNode;
}

export const SettingsFlyoutContainer: React.FC<SettingsFlyoutContainerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFlyout = () => setIsOpen(!isOpen);
  const closeFlyout = () => setIsOpen(false);

  return (
    <>
      <IconButton
        aria-label="Open settings"
        className="text-fgColor-secondary hover:text-fgColor-primary"
        dataTestId="settings-toggle"
        icon={<CogIcon size={16} />}
        onClick={toggleFlyout}
      />

      <Flyout data-testid="settings-modal" isOpen={isOpen} onClose={closeFlyout} side="right" widthClass="w-[28rem]">
        <div className="flex items-center justify-between border-b border-fgColor-secondary/20 p-4">
          <h2 className="text-xl font-semibold text-fgColor-primary">Settings</h2>
          <IconButton
            className="text-fgColor-secondary hover:text-fgColor-primary"
            dataTestId="modal-close-button"
            icon={<X size={16} />}
            onClick={closeFlyout}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4" style={{ overflowY: 'auto' }}>
          {children}
        </div>
      </Flyout>
    </>
  );
};
