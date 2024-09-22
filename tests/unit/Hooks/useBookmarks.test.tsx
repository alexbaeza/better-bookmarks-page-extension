import { useBookmarks } from '../../../src/Hooks/useBookmarks';
import { useAppStateContext } from '../../../src/Context/app-state-context';
import { renderHook } from '@testing-library/react';
import { BookmarksData } from '../../../src/Data/bookmarks';
import { IBookmarkItem } from '../../../src/Components/Bookmark/BookmarkFolderRoot';

jest.mock('../../../src/Context/app-state-context');

describe('useBookmarks', () => {
  let mockAppStateContext: jest.MockedFunction<typeof useAppStateContext>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppStateContext = useAppStateContext as jest.MockedFunction<
      typeof useAppStateContext
    >;
  });

  it('calls getBookmarks when provider is not initialised', () => {
    const getBookmarksMock = jest.fn();

    mockAppStateContext.mockReturnValue({
      providerInitialised: false,
      getBookmarks: getBookmarksMock,
      bookmarks: { folders: [], uncategorized: undefined },
      currentPage: 'All',
      setCurrentPage: jest.fn(),
      filteredData: [],
      isLoading: false,
      error: undefined
    });

    renderHook(() => useBookmarks());

    expect(getBookmarksMock).toHaveBeenCalledTimes(1);
  });

  it('does not call getBookmarks when provider is already initialised', () => {
    const getBookmarksMock = jest.fn();

    mockAppStateContext.mockReturnValue({
      providerInitialised: true,
      getBookmarks: getBookmarksMock,
      bookmarks: { folders: [], uncategorized: undefined },
      currentPage: 'All',
      setCurrentPage: jest.fn(),
      filteredData: [],
      isLoading: false,
      error: undefined
    });

    renderHook(() => useBookmarks());

    expect(getBookmarksMock).not.toHaveBeenCalled();
  });

  it('returns the correct context values', () => {
    const mockBookmarks: BookmarksData = {
      folders: [{ id: '1', title: 'Test Folder' } as IBookmarkItem],
      uncategorized: undefined
    };
    const mockFilteredData: IBookmarkItem[] = [
      { id: '1', title: 'Filtered Bookmark' }
    ];

    mockAppStateContext.mockReturnValue({
      providerInitialised: true,
      getBookmarks: jest.fn(),
      bookmarks: mockBookmarks,
      currentPage: 'All',
      setCurrentPage: jest.fn(),
      filteredData: mockFilteredData,
      isLoading: false,
      error: undefined
    });

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.bookmarks).toEqual(mockBookmarks);
    expect(result.current.currentPage).toBe('All');
    expect(result.current.filteredData).toEqual(mockFilteredData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('handles the loading state correctly', () => {
    mockAppStateContext.mockReturnValue({
      providerInitialised: true,
      getBookmarks: jest.fn(),
      bookmarks: { folders: [], uncategorized: undefined },
      currentPage: 'All',
      setCurrentPage: jest.fn(),
      filteredData: [],
      isLoading: true,
      error: undefined
    });

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state correctly', () => {
    const mockError = new Error('Failed to load bookmarks');

    mockAppStateContext.mockReturnValue({
      providerInitialised: true,
      getBookmarks: jest.fn(),
      bookmarks: { folders: [], uncategorized: undefined },
      currentPage: 'All',
      setCurrentPage: jest.fn(),
      filteredData: [],
      isLoading: false,
      error: mockError
    });

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.error).toBe(mockError);
  });

  it('returns a function to set the current page', () => {
    const setCurrentPageMock = jest.fn();

    mockAppStateContext.mockReturnValue({
      providerInitialised: true,
      getBookmarks: jest.fn(),
      bookmarks: { folders: [], uncategorized: undefined },
      currentPage: 'All',
      setCurrentPage: setCurrentPageMock,
      filteredData: [],
      isLoading: false,
      error: undefined
    });

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.setCurrentPage).toBe(setCurrentPageMock);
    result.current.setCurrentPage('another-page');
    expect(setCurrentPageMock).toHaveBeenCalledWith('another-page');
  });
});
