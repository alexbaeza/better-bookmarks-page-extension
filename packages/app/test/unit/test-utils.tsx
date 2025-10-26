import { type RenderOptions, render } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
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

const HydrateAtoms: React.FC<{ initialValues: any; children: React.ReactNode }> = ({ initialValues, children }) => {
  useHydrateAtoms(initialValues);
  return <>{children}</>;
};

const MockJotaiProvider: React.FC<{ children: React.ReactNode; initialValues?: any }> = ({ children, initialValues = [] }) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

const MockBookmarkProviders: React.FC<{ children: React.ReactNode; initialValues?: any }> = ({ children, initialValues = [] }) => (
  <MockJotaiProvider initialValues={initialValues}>
    <MockAppStateProvider>
      <MockBookmarkNavigationProvider>
        <MockBookmarkSearchProvider>{children}</MockBookmarkSearchProvider>
      </MockBookmarkNavigationProvider>
    </MockAppStateProvider>
  </MockJotaiProvider>
);

const AllProviders: React.FC<{ children: React.ReactNode; initialValues?: any }> = ({ children, initialValues = [] }) => (
  <MockJotaiProvider initialValues={initialValues}>
    <MockAppStateProvider>
      <MockBookmarkNavigationProvider>
        <MockBookmarkSearchProvider>
          <MockDragDropProvider>
            <MockModalProvider>{children}</MockModalProvider>
          </MockDragDropProvider>
        </MockBookmarkSearchProvider>
      </MockBookmarkNavigationProvider>
    </MockAppStateProvider>
  </MockJotaiProvider>
);

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { initialValues?: any }) => {
  const { initialValues, ...rest } = options || {};
  return render(ui, { wrapper: (props) => <AllProviders {...props} initialValues={initialValues} />, ...rest });
};

const renderWithModalProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: MockModalProvider, ...options });

const renderWithBookmarkProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockBookmarkNavigationProvider, ...options });

const renderWithBookmarkSearchProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockBookmarkSearchProvider, ...options });

const renderWithAppStateProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockAppStateProvider, ...options });

const renderWithDragDropProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockDragDropProvider, ...options });

const renderWithBookmarkProviders = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { initialValues?: any }) => {
  const { initialValues, ...rest } = options || {};
  return render(ui, { wrapper: (props) => <MockBookmarkProviders {...props} initialValues={initialValues} />, ...rest });
};

const renderWithJotaiProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { initialValues?: any }) => {
  const { initialValues, ...rest } = options || {};
  return render(ui, { wrapper: (props) => <MockJotaiProvider {...props} initialValues={initialValues} />, ...rest });
};

export * from '@testing-library/react';
export {
  customRender as render,
  renderWithModalProvider,
  renderWithBookmarkProvider,
  renderWithBookmarkSearchProvider,
  renderWithAppStateProvider,
  renderWithDragDropProvider,
  renderWithBookmarkProviders,
  renderWithJotaiProvider,
  AllProviders,
  MockModalProvider,
  MockBookmarkNavigationProvider,
  MockBookmarkSearchProvider,
  MockAppStateProvider,
  MockDragDropProvider,
  MockBookmarkProviders,
  MockJotaiProvider,
};
