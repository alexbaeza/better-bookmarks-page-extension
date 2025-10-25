import { type RenderOptions, render } from '@testing-library/react';
import type React from 'react';

import { ModalProvider } from '@/app/providers/modal-context';

const MockModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <ModalProvider>{children}</ModalProvider>;

const MockBookmarkNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const MockBookmarkSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const MockAppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const MockDragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const MockBookmarkProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MockAppStateProvider>
    <MockBookmarkNavigationProvider>
      <MockBookmarkSearchProvider>{children}</MockBookmarkSearchProvider>
    </MockBookmarkNavigationProvider>
  </MockAppStateProvider>
);

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MockAppStateProvider>
    <MockBookmarkNavigationProvider>
      <MockBookmarkSearchProvider>
        <MockDragDropProvider>
          <MockModalProvider>{children}</MockModalProvider>
        </MockDragDropProvider>
      </MockBookmarkSearchProvider>
    </MockBookmarkNavigationProvider>
  </MockAppStateProvider>
);

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllProviders, ...options });

const renderWithModalProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: MockModalProvider, ...options });

const renderWithBookmarkProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockBookmarkNavigationProvider, ...options });

const renderWithBookmarkSearchProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockBookmarkSearchProvider, ...options });

const renderWithAppStateProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockAppStateProvider, ...options });

const renderWithDragDropProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockDragDropProvider, ...options });

const renderWithBookmarkProviders = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockBookmarkProviders, ...options });

export * from '@testing-library/react';
export {
  customRender as render,
  renderWithModalProvider,
  renderWithBookmarkProvider,
  renderWithBookmarkSearchProvider,
  renderWithAppStateProvider,
  renderWithDragDropProvider,
  renderWithBookmarkProviders,
  AllProviders,
  MockModalProvider,
  MockBookmarkNavigationProvider,
  MockBookmarkSearchProvider,
  MockAppStateProvider,
  MockDragDropProvider,
  MockBookmarkProviders,
};


