import { vi } from 'vitest';

vi.mock('jotai', async () => {
  const actual = await vi.importActual('jotai');
  return {
    ...actual,
    useAtom: vi.fn(() => [undefined, vi.fn()]),
    useAtomValue: vi.fn(() => undefined),
    useSetAtom: vi.fn(() => vi.fn()),
  };
});

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
    isLoading: false,
    error: null,
    providerInitialised: true,
    refreshBookmarks: vi.fn(),
    updateBookmarkLayout: vi.fn(),
  };

  return {
    AppStateContext: {
      Provider: ({ children }: { children: React.ReactNode }) => children,
    },
    useAppStateContext: vi.fn(() => mockInitialContext),
    initialContext: mockInitialContext,
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
    currentPage: 'All',
    searchTerm: '',
    setSearchTerm: vi.fn(),
    rawFolders: [],
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    updateLayout: vi.fn(),
    isLoading: false,
    error: null,
    items: [],
    counts: { total: 0, folders: 0, uncategorized: 0 },
    pageContainers: [],
  })),
}));

vi.mock('@/shared/hooks/useRawBookmarkData', () => ({
  useRawBookmarkData: vi.fn(() => ({
    rawFolders: [],
    rawUncategorized: undefined,
    isLoading: false,
    error: null,
    refresh: vi.fn(),
  })),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkSearch', () => ({
  useBookmarkSearch: vi.fn(() => ({
    searchTerm: '',
    setSearchTerm: vi.fn(),
    pageContainers: [],
    items: [],
    counts: { total: 0, folders: 0, uncategorized: 0 },
  })),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkActions', () => ({
  useBookmarkActions: vi.fn(() => ({
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    updateLayout: vi.fn(),
  })),
}));

Object.assign(global, {
  chrome: {
    bookmarks: {
      getTree: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      move: vi.fn(),
      search: vi.fn(),
    },
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
    },
  },
});


