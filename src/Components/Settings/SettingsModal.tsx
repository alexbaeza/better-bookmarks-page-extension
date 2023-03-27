import React, { useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { CrossIcon, GearIcon } from '../IconButton/icons/Icons';
import { GreetingSettings } from './GreetingSettings';
import { Footer } from '../Footer/Footer';
import { Sponsor } from '../Sponsor/Sponsor';
import { BackgroundSettings } from './BackgroundSettings';

export const SettingsModal = () => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <IconButton onClick={() => setShow(true)} icon={<GearIcon />} />
      <div className="relative">
        {show && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
            <div
              className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"
              onClick={() => setShow(false)}
            ></div>
            <div className="relative w-[80%] rounded-lg bg-custom-primary-dark p-4 shadow lg:max-w-2xl">
              <IconButton onClick={() => setShow(false)} icon={<CrossIcon />} />
              <div>
                <div className="p-6">
                  <div className="mx-auto mb-4 h-14 w-14 text-custom-text-primary">
                    <GearIcon size={'md'} />
                  </div>
                  <div className="font-base mr-2 text-center text-sm uppercase leading-6 text-custom-text-primary">
                    {'Settings'}
                  </div>
                  <div className="container">
                    <div className="h-full w-full rounded-lg object-cover ">
                      <div className="mb-6">
                        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 divide-y divide-custom-text-primary">
                          <div>
                            <GreetingSettings />
                          </div>
                          <div>
                            <BackgroundSettings />
                          </div>
                          <div>
                            <Sponsor />
                          </div>
                        </div>
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
