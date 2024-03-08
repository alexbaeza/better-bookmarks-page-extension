import { renderHook, waitFor } from '@testing-library/react';
import { useBookmarks } from '../../../src/Hooks/useBookmarks';
import { Bookmarks } from '../../../src/Data/bookmarks';

describe('useBookmarks', () => {
  let bookmarksSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    bookmarksSpy = jest.spyOn(Bookmarks, 'getFolders');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return data and loading false when getFolders() is resolved', async () => {
    const mockData = [{ id: 1, title: 'Folder 1', children: [] }];
    bookmarksSpy.mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useBookmarks());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
    expect(result.current.loading).toEqual(false);
  });
});
