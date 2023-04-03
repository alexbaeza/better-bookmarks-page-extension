import { renderHook } from '@testing-library/react-hooks';
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
    const { result, waitForNextUpdate } = renderHook(() => useBookmarks());
    await waitForNextUpdate();
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toEqual(false);
  });
});
