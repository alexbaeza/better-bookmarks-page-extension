import { type RenderOptions, render } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';

import { ModalProvider } from '@/app/providers/modal-context';

const MockModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ModalProvider>{children}</ModalProvider>
);

// Generic mock provider for components that just pass through children
const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const HydrateAtoms: React.FC<{ initialValues: any; children: React.ReactNode }> = ({ initialValues, children }) => {
  useHydrateAtoms(initialValues);
  return <>{children}</>;
};

const MockJotaiProvider: React.FC<{ children: React.ReactNode; initialValues?: any }> = ({
  children,
  initialValues = [],
}) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

const MockBookmarkProviders: React.FC<{ children: React.ReactNode; initialValues?: any }> = ({
  children,
  initialValues = [],
}) => (
  <MockJotaiProvider initialValues={initialValues}>
    <MockProvider>{children}</MockProvider>
  </MockJotaiProvider>
);

const AllProviders: React.FC<{ children: React.ReactNode; initialValues?: any }> = ({
  children,
  initialValues = [],
}) => (
  <MockJotaiProvider initialValues={initialValues}>
    <MockProvider>
      <MockModalProvider>{children}</MockModalProvider>
    </MockProvider>
  </MockJotaiProvider>
);

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { initialValues?: any }) => {
  const { initialValues, ...rest } = options || {};
  return render(ui, { wrapper: (props) => <AllProviders {...props} initialValues={initialValues} />, ...rest });
};

const renderWithModalProvider = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MockModalProvider, ...options });

const renderWithBookmarkProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialValues?: any }
) => {
  const { initialValues, ...rest } = options || {};
  return render(ui, {
    wrapper: (props) => <MockBookmarkProviders {...props} initialValues={initialValues} />,
    ...rest,
  });
};

const renderWithJotaiProvider = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialValues?: any }
) => {
  const { initialValues, ...rest } = options || {};
  return render(ui, { wrapper: (props) => <MockJotaiProvider {...props} initialValues={initialValues} />, ...rest });
};

export * from '@testing-library/react';
export {
  customRender as render,
  renderWithModalProvider,
  renderWithBookmarkProviders,
  renderWithJotaiProvider,
  AllProviders,
  MockModalProvider,
  MockProvider,
  MockBookmarkProviders,
  MockJotaiProvider,
};
