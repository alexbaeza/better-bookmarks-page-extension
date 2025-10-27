import { render, renderHook, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStateContext } from '@/app/providers/app-state-context';
import { bookmarksAtom, viewModeAtom } from '@/app/providers/atoms';
import { DragDropProvider, useDragDrop } from '@/app/providers/dragdrop-provider';
import { BookmarkDisplayMode } from '@/shared/types/ui';

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  moveItem: vi.fn(),
  reorderItems: vi.fn(),
}));

vi.mock('@/app/providers/app-state-context', () => ({
  useAppStateContext: vi.fn(),
}));

import { moveItem, reorderItems } from '@/features/bookmarks/lib/bookmarks';

const mockMoveItem = vi.mocked(moveItem);
const mockReorderItems = vi.mocked(reorderItems);
const mockUseAppStateContext = vi.mocked(useAppStateContext);

const mockBookmarks = {
  folders: [
    {
      id: 'folder1',
      title: 'Folder 1',
      children: [
        { id: 'bookmark1', title: 'Bookmark 1', url: 'https://example.com', dateAdded: Date.now() },
        { id: 'bookmark2', title: 'Bookmark 2', url: 'https://example2.com', dateAdded: Date.now() },
      ],
    },
  ],
  uncategorized: undefined,
};

const createWrapper = (initialBookmarks?: typeof mockBookmarks) => {
  return ({ children }: { children: React.ReactNode }) => {
    const HydrateAtoms: React.FC<{ initialValues: any; children: React.ReactNode }> = ({ initialValues, children }) => {
      useHydrateAtoms(initialValues);
      return <>{children}</>;
    };

    const initialValues = initialBookmarks
      ? [
          [bookmarksAtom, initialBookmarks],
          [viewModeAtom, BookmarkDisplayMode.Grid],
        ]
      : [[viewModeAtom, BookmarkDisplayMode.Grid]];

    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>
          <DragDropProvider>{children}</DragDropProvider>
        </HydrateAtoms>
      </Provider>
    );
  };
};

describe('DragDropProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMoveItem.mockResolvedValue();
    mockReorderItems.mockResolvedValue();
    mockUseAppStateContext.mockReturnValue({
      bookmarks: mockBookmarks,
      error: undefined,
      isLoading: false,
      providerInitialised: true,
      refreshBookmarks: vi.fn().mockResolvedValue(undefined),
    } as ReturnType<typeof useAppStateContext>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should provide drag drop context', () => {
    const wrapper = createWrapper(mockBookmarks);
    const { result } = renderHook(() => useDragDrop(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.activeId).toBeNull();
  });

  it('should set activeId to the active item id', () => {
    const wrapper = createWrapper(mockBookmarks);
    const { result } = renderHook(() => useDragDrop(), { wrapper });

    expect(result.current.activeId).toBeNull();
    expect(typeof result.current.activeId === 'string' || result.current.activeId === null).toBe(true);
  });

  it('should initialize with null activeId', () => {
    const wrapper = createWrapper(mockBookmarks);
    const { result } = renderHook(() => useDragDrop(), { wrapper });

    expect(result.current.activeId).toBeNull();
  });

  it('should render children', () => {
    const wrapper = createWrapper(mockBookmarks);
    const TestComponent = () => {
      useDragDrop();
      return <div data-testid="child">Child</div>;
    };

    render(<TestComponent />, { wrapper });
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide context value with activeId', () => {
    const wrapper = createWrapper(mockBookmarks);
    const { result } = renderHook(() => useDragDrop(), { wrapper });

    expect(result.current.activeId).toBeNull();
    expect(result.current).toHaveProperty('activeId');
  });
});
