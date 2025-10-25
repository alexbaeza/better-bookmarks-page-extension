import type React from 'react';

import { AppStateProvider } from '@/app/providers/app-state-provider';
import { DragDropProvider } from '@/app/providers/dragdrop-provider';
import { ModalProvider } from '@/app/providers/modal-context';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { BookmarkNavigationProvider } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkSearchProvider } from '@/features/bookmarks/contexts/BookmarkSearchContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppStateProvider>
    <ThemeProvider>
      <BookmarkNavigationProvider>
        <BookmarkSearchProvider>
          <DragDropProvider>
            <ModalProvider>{children}</ModalProvider>
          </DragDropProvider>
        </BookmarkSearchProvider>
      </BookmarkNavigationProvider>
    </ThemeProvider>
  </AppStateProvider>
);
