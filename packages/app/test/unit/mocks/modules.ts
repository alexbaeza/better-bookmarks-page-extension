import { vi } from 'vitest';

// NOTE: This file is deprecated and should not be used.
// All tests should now use `vi.spyOn` instead of module mocks per testing.mdc guidance.
// See https://github.com/alexbaeza/better-bookmarks-page-extension/wiki/Testing-Standards

// Removed outdated vi.mock('jotai') - tests should use vi.spyOn instead

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  BookmarkNavigationProvider: ({ children }: { children: React.ReactNode }) => children,
  useBookmarkNavigation: vi.fn(() => ({
    currentPage: 'All',
    setCurrentPage: vi.fn(),
  })),
}));

vi.mock('@/features/bookmarks/contexts/BookmarkSearchContext', () => ({
  BookmarkSearchProvider: ({ children }: { children: React.ReactNode }) => children,
  useBookmarkSearchTerm: vi.fn(() => ({
    searchTerm: '',
    setSearchTerm: vi.fn(),
  })),
}));

vi.mock('@/app/providers/app-state-context', () => {
  const mockInitialContext = {
    bookmarks: { folders: [], uncategorized: undefined },
    error: null,
    isLoading: false,
    providerInitialised: true,
    refreshBookmarks: vi.fn(),
    updateBookmarkLayout: vi.fn(),
  };

  return {
    AppStateContext: {
      Provider: ({ children }: { children: React.ReactNode }) => children,
    },
    initialContext: mockInitialContext,
    useAppStateContext: vi.fn(() => mockInitialContext),
  };
});

vi.mock('@/app/providers/dragdrop-provider', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => children,
  useDragDrop: vi.fn(() => ({
    activeId: null,
    setActiveId: vi.fn(),
  })),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(() => ({
    counts: { folders: 0, total: 0, uncategorized: 0 },
    create: vi.fn(),
    currentPage: 'All',
    error: null,
    isLoading: false,
    items: [],
    move: vi.fn(),
    pageContainers: [],
    rawFolders: [],
    remove: vi.fn(),
    searchTerm: '',
    setSearchTerm: vi.fn(),
    update: vi.fn(),
    updateLayout: vi.fn(),
  })),
}));

vi.mock('@/shared/hooks/useRawBookmarkData', () => ({
  useRawBookmarkData: vi.fn(() => ({
    error: null,
    isLoading: false,
    rawFolders: [],
    rawUncategorized: undefined,
    refresh: vi.fn(),
  })),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkSearch', () => ({
  useBookmarkSearch: vi.fn(() => ({
    counts: { folders: 0, total: 0, uncategorized: 0 },
    items: [],
    pageContainers: [],
    searchTerm: '',
    setSearchTerm: vi.fn(),
  })),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkActions', () => ({
  useBookmarkActions: vi.fn(() => ({
    create: vi.fn(),
    move: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
    updateLayout: vi.fn(),
  })),
}));

Object.assign(global, {
  chrome: {
    bookmarks: {
      create: vi.fn(),
      get: vi.fn(),
      getTree: vi.fn(),
      move: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
      update: vi.fn(),
    },
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
    },
  },
});
