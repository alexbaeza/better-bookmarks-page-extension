import React, { useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { CrossIcon, GearIcon } from '../IconButton/Icons/Icons';
import { GreetingSettings } from './GreetingSettings';
import { Footer } from '../Footer/Footer';
import { Sponsor } from '../Sponsor/Sponsor';
import { BackgroundOverlaySettings } from './BackgroundOverlaySettings';
import { ThemeSettings } from './ThemeSettings';
import { Divider } from '../Divider/Divider';

export const SettingsModal = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <IconButton
        dataTestId="options-modal-button"
        onClick={() => setShow(true)}
        icon={<GearIcon />}
      />
      <div className="relative">
        {show && (
          <div
            data-testid="options-modal-content"
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setShow(false)}
            ></div>
            <div className="relative w-4/5 rounded-lg bg-primary-dark p-4 shadow lg:max-w-2xl">
              <IconButton
                dataTestId="options-modal-content-close-button"
                onClick={() => setShow(false)}
                icon={<CrossIcon />}
              />
              <div>
                <div className="p-6">
                  <div className="mx-auto mb-4 size-14 text-text-primary">
                    <GearIcon size={'md'} />
                  </div>
                  <div className="font-base mr-2 text-center text-sm uppercase leading-6 text-text-primary">
                    {'Settings'}
                  </div>
                  <div className="container">
                    <div className="size-full rounded-lg object-cover ">
                      <div className="grid grid-flow-row-dense grid-cols-1">
                        <Divider title="Greeting" />
                        <GreetingSettings dataTestId="greeting-settings" />
                        <Divider title="Overlay" />
                        <BackgroundOverlaySettings dataTestId="background-overlay-settings" />
                        <Divider title="Theme" />
                        <ThemeSettings dataTestId="theme-settings" />
                        <Sponsor dataTestId="sponsor" />
                      </div>
                      <Footer />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
