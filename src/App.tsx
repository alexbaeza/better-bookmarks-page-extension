import React from 'react';
import { SettingsModal } from './Components/Settings/SettingsModal';
import { Greeting } from './Components/Greeting/Greeting';
import { Footer } from './Components/Footer/Footer';
import { useAtomValue } from 'jotai';
import { themeAtom } from './Context/atoms';
import { ViewModeToggle } from './Sections/ViewModeToggle';
import { Background } from './Sections/Background';
import { Content } from './Sections/Content';

export const App = () => {
  const theme = useAtomValue(themeAtom);

  return (
    <div className={theme}>
      <section className="min-h-screen bg-primary-dark">
        <Background />
        <div className="absolute min-h-screen bg-primary-dark">
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
      </section>
    </div>
  );
};
