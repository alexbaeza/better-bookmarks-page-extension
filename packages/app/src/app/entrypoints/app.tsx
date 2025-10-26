// src/app/entrypoints/app.tsx
import { useAtomValue } from 'jotai';
import type React from 'react';
import { themeAtom, zoomAtom } from '@/app/providers/atoms';
import { AppProviders } from '@/app/providers/providers';
import { AppRoutes } from '@/app/routing/routes';
import { BackgroundOverlay } from '@/shared/ui/BackgroundOverlay';

import { MainLayout } from '../layouts/MainLayout';

export const App: React.FC = () => {
  const themeClass = useAtomValue(themeAtom);
  const zoom = useAtomValue(zoomAtom);

  return (
    <AppProviders>
      <div className={`flex h-screen max-h-screen flex-col overflow-hidden bg-bgColor-primary ${themeClass}`} data-testid="app-container" style={{ zoom }}>
        <BackgroundOverlay />
        <MainLayout>
          <AppRoutes />
        </MainLayout>
        <div id="modal-root" />
        <div id="bookmark-menu-portal" />
      </div>
    </AppProviders>
  );
};
