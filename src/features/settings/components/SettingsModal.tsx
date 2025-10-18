import { CogIcon } from 'lucide-react';
import type React from 'react';

import { useModal } from '@/app/providers/modal-context';
import { AppFooter } from '@/shared/ui/AppFooter';
import { Divider } from '@/shared/ui/Divider';
import { IconButton } from '@/shared/ui/IconButton';
import { Modal } from '@/shared/ui/Modal';
import { Sponsor } from '@/shared/ui/Sponsor';

import { BackgroundOverlaySettings } from './BackgroundOverlaySettings';
import { GreetingSettings } from './GreetingSettings';
import { SidebarSettings } from './SidebarSettings';
import { ThemeSettings } from './ThemeSettings';
import { ZoomSettings } from './ZoomSettings';

export const SettingsModal: React.FC = () => {
  const { showModal, hideModal } = useModal();

  const open = () => {
    showModal(
      <Modal title="Settings" size="lg" onClose={hideModal}>
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6">
            <SidebarSettings dataTestId="sidebar-settings" />

            <Divider title="Zoom" />
            <ZoomSettings dataTestId="zoom-settings" />

            <Divider title="Greeting Options" />
            <GreetingSettings dataTestId="greeting-settings" />

            <Divider title="Background Overlay Options" />
            <BackgroundOverlaySettings dataTestId="background-overlay-settings" />

            <Divider title="Theme Options" />
            <ThemeSettings dataTestId="theme-settings" />

            <Sponsor dataTestId="sponsor" />
          </div>
          <AppFooter />
        </div>
      </Modal>
    );
  };

  return (
    <IconButton dataTestId="options-modal-button" onClick={open} icon={<CogIcon size={16} />} className="text-fgColor-secondary hover:text-fgColor-primary" />
  );
};
