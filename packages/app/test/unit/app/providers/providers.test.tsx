import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { AppProviders } from '@/app/providers/providers';
import { AllProviders } from '~test/test-utils';

vi.mock('@/app/providers/app-state-provider', () => ({
  AppStateProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-state-provider">{children}</div>
  ),
}));

vi.mock('@/app/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext')>(
    '@/features/bookmarks/contexts/BookmarkNavigationContext'
  );
  return {
    ...actual,
    BookmarkNavigationProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bookmark-navigation-provider">{children}</div>
    ),
  };
});

vi.mock('@/features/bookmarks/contexts/BookmarkSearchContext', () => ({
  BookmarkSearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bookmark-search-provider">{children}</div>
  ),
}));

vi.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dragdrop-provider">{children}</div>,
}));

vi.mock('@/app/providers/modal-context', () => ({
  ModalProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-provider">{children}</div>,
}));

describe('AppProviders', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all providers in correct order', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>
          <div data-testid="app-content">App Content</div>
        </AppProviders>
      </AllProviders>
    );

    expect(container.querySelector('[data-testid="app-state-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="theme-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="bookmark-navigation-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="bookmark-search-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="dragdrop-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="modal-provider"]')).toBeInTheDocument();
  });

  it('renders children at the innermost level', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>
          <div data-testid="app-content">App Content</div>
        </AppProviders>
      </AllProviders>
    );

    const modalProvider = container.querySelector('[data-testid="modal-provider"]');
    expect(modalProvider).toBeInTheDocument();
    expect(modalProvider?.querySelector('[data-testid="app-content"]')).toBeInTheDocument();
  });

  it('maintains correct provider nesting hierarchy', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>
          <div data-testid="app-content">App Content</div>
        </AppProviders>
      </AllProviders>
    );

    const appStateProvider = container.querySelector('[data-testid="app-state-provider"]');
    const themeProvider = appStateProvider?.querySelector('[data-testid="theme-provider"]');
    const dragdropProvider = themeProvider?.querySelector('[data-testid="dragdrop-provider"]');
    const navigationProvider = dragdropProvider?.querySelector('[data-testid="bookmark-navigation-provider"]');
    const searchProvider = navigationProvider?.querySelector('[data-testid="bookmark-search-provider"]');
    const modalProvider = searchProvider?.querySelector('[data-testid="modal-provider"]');
    const appContent = modalProvider?.querySelector('[data-testid="app-content"]');

    expect(appStateProvider).toBeInTheDocument();
    expect(themeProvider).toBeInTheDocument();
    expect(navigationProvider).toBeInTheDocument();
    expect(searchProvider).toBeInTheDocument();
    expect(dragdropProvider).toBeInTheDocument();
    expect(modalProvider).toBeInTheDocument();
    expect(appContent).toBeInTheDocument();
  });

  it('handles multiple children correctly', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <span data-testid="child3">Child 3</span>
        </AppProviders>
      </AllProviders>
    );

    const modalProvider = container.querySelector('[data-testid="modal-provider"]');
    expect(modalProvider?.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(modalProvider?.querySelector('[data-testid="child2"]')).toBeInTheDocument();
    expect(modalProvider?.querySelector('[data-testid="child3"]')).toBeInTheDocument();
  });

  it('handles fragment children correctly', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>
          <div data-testid="fragment-child1">Fragment Child 1</div>
          <div data-testid="fragment-child2">Fragment Child 2</div>
        </AppProviders>
      </AllProviders>
    );

    const modalProvider = container.querySelector('[data-testid="modal-provider"]');
    expect(modalProvider?.querySelector('[data-testid="fragment-child1"]')).toBeInTheDocument();
    expect(modalProvider?.querySelector('[data-testid="fragment-child2"]')).toBeInTheDocument();
  });

  it('handles null children gracefully', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>{null}</AppProviders>
      </AllProviders>
    );

    expect(container.querySelector('[data-testid="app-state-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="modal-provider"]')).toBeInTheDocument();
  });

  it('handles undefined children gracefully', () => {
    const { container } = render(
      <AllProviders>
        <AppProviders>{undefined}</AppProviders>
      </AllProviders>
    );

    expect(container.querySelector('[data-testid="app-state-provider"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="modal-provider"]')).toBeInTheDocument();
  });
});
