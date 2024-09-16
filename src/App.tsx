/* eslint-disable no-unused-vars */
import React from 'react';
import { SettingsModal } from './Components/Settings/SettingsModal';
import { Greeting } from './Components/Greeting/Greeting';
import { useAtomValue } from 'jotai';
import { themeAtom } from './Context/atoms';
import { ViewModeToggle } from './Sections/ViewModeToggle';
import { Content } from './Sections/Content';
import { Background } from './Sections/Background';
import { Sidebar } from './Components/Sidebar/Sidebar';
import { AppStateProvider } from './Context/app-state-provider';

export const App = () => {
  const theme = useAtomValue(themeAtom);

  return (
    <AppStateProvider>
      <Background />
      <div className={'flex max-h-screen flex-row bg-primary-dark ' + theme}>
        <Sidebar />
        <div
          id="content"
          className=" h-screen sticky flex flex-col w-full overflow-y-auto"
        >
          <SettingsModal />
          <Greeting />
          <ViewModeToggle />
          <section className="flex flex-grow flex-col items-center px-3 pt-3">
            <Content />
          </section>
        </div>
      </div>
    </AppStateProvider>
  );
};
