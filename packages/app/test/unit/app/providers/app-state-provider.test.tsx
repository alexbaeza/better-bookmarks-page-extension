import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/app/providers/app-state-context', async () => {
  return await vi.importActual('@/app/providers/app-state-context');
});

import { AppStateContext } from '@/app/providers/app-state-context';
import { AppStateProvider } from '@/app/providers/app-state-provider';
import { getBookmarksData } from '@/features/bookmarks/lib/bookmarks';

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  getBookmarksData: vi.fn(),
}));

describe('AppStateProvider', () => {
  let mockGetBookmarksData: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBookmarksData = vi.mocked(getBookmarksData);
  });

  it('renders children', () => {
    render(
      <AppStateProvider>
        <div data-testid="test-child">Test Child</div>
      </AppStateProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('fetches bookmarks data on mount', async () => {
    render(
      <AppStateProvider>
        <div>Test</div>
      </AppStateProvider>
    );

    await waitFor(() => {
      expect(mockGetBookmarksData).toHaveBeenCalled();
    });
  });

  it('handles fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetBookmarksData.mockRejectedValue(new Error('Fetch failed'));

    render(
      <AppStateProvider>
        <div>Test</div>
      </AppStateProvider>
    );

    await waitFor(() => {
      expect(mockGetBookmarksData).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('provides context values', async () => {
    let contextValue: any;

    const Consumer = () => {
      contextValue = React.useContext(AppStateContext);
      return <div data-testid="consumer">Consumer</div>;
    };

    render(
      <AppStateProvider>
        <Consumer />
      </AppStateProvider>
    );

    await waitFor(() => {
      expect(contextValue).toBeDefined();
      expect(contextValue).toHaveProperty('bookmarks');
      expect(contextValue).toHaveProperty('isLoading');
      expect(contextValue).toHaveProperty('error');
      expect(contextValue).toHaveProperty('providerInitialised');
      expect(contextValue).toHaveProperty('refreshBookmarks');
    });
  });

  it('initializes with providerInitialised as true after mount', async () => {
    let contextValue: any;

    const Consumer = () => {
      contextValue = React.useContext(AppStateContext);
      return <div data-testid="initialised">{contextValue?.providerInitialised?.toString()}</div>;
    };

    render(
      <AppStateProvider>
        <Consumer />
      </AppStateProvider>
    );

    await waitFor(() => {
      expect(contextValue?.providerInitialised).toBe(true);
    });
  });
});
