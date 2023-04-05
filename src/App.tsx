import React from 'react';
import { SettingsModal } from './Components/Settings/SettingsModal';
import { Greeting } from './Components/Greeting/Greeting';
import { Footer } from './Components/Footer/Footer';
import { useAtomValue } from 'jotai';
import { themeAtom } from './Context/atoms';
import { ViewModeToggle } from './Sections/ViewModeToggle';
import { Content } from './Sections/Content';
import { Background } from './Sections/Background';

export const App = () => {
  const theme = useAtomValue(themeAtom);

  return (
    <div
      className={
        'flex min-h-screen flex-col overflow-auto bg-primary-dark ' + theme
      }
    >
      <Background />
      <div id="content" className="flex-grow">
        <SettingsModal />
        <Greeting />
        <ViewModeToggle />
        <section className="flex flex-grow flex-col items-center justify-center px-3 pt-3">
          <Content />
        </section>
        <section className="p-6">
          <Footer />
        </section>
      </div>
    </div>
  );
};
