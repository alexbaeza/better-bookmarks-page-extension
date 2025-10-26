import { vi } from 'vitest';

vi.mock('@/features/bookmarks/lib/browser/api/mock-data-service', () => ({
  mockDataService: {
    createBookmark: vi.fn(),
    getBookmark: vi.fn(),
    getData: vi.fn(),
    moveBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    reorderItems: vi.fn(),
    reset: vi.fn(),
    searchBookmarks: vi.fn(),
    subscribe: vi.fn(),
    updateBookmark: vi.fn(),
  },
}));

import { mockDataService } from '@/features/bookmarks/lib/browser/api/mock-data-service';

describe('MockDataService', () => {
  let mockMockDataService: ReturnType<typeof vi.mocked<typeof mockDataService>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMockDataService = vi.mocked(mockDataService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getData', () => {
    it('returns data with ordering applied', () => {
      const mockData = [
        {
          children: [],
          id: '1',
          title: 'Test',
        },
      ];
      mockMockDataService.getData.mockReturnValue(mockData);

      const result = mockMockDataService.getData();

      expect(result).toBe(mockData);
    });
  });

  describe('subscribe', () => {
    it('adds listener and returns unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = vi.fn();

      mockMockDataService.subscribe.mockReturnValue(unsubscribe);

      const result = mockMockDataService.subscribe(listener);

      expect(mockMockDataService.subscribe).toHaveBeenCalledWith(listener);
      expect(result).toBe(unsubscribe);
    });
  });

  describe('createBookmark', () => {
    it('creates a bookmark with valid parent', async () => {
      const mockBookmark = {
        id: '3',
        parentId: '1',
        title: 'New Bookmark',
        url: 'https://example.com',
      };

      mockMockDataService.createBookmark.mockResolvedValue(mockBookmark);

      const result = await mockMockDataService.createBookmark('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });

      expect(mockMockDataService.createBookmark).toHaveBeenCalledWith('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });
      expect(result).toBe(mockBookmark);
    });

    it('creates a bookmark without parent', async () => {
      const mockBookmark = {
        id: '3',
        title: 'Root Bookmark',
        url: 'https://example.com',
      };

      mockMockDataService.createBookmark.mockResolvedValue(mockBookmark);

      const result = await mockMockDataService.createBookmark(null, {
        title: 'Root Bookmark',
        url: 'https://example.com',
      });

      expect(mockMockDataService.createBookmark).toHaveBeenCalledWith(null, {
        title: 'Root Bookmark',
        url: 'https://example.com',
      });
      expect(result).toBe(mockBookmark);
    });

    it('creates a folder', async () => {
      const mockFolder = {
        children: [],
        id: '4',
        title: 'New Folder',
      };

      mockMockDataService.createBookmark.mockResolvedValue(mockFolder);

      const result = await mockMockDataService.createBookmark('1', {
        title: 'New Folder',
      });

      expect(mockMockDataService.createBookmark).toHaveBeenCalledWith('1', {
        title: 'New Folder',
      });
      expect(result).toBe(mockFolder);
    });
  });

  describe('updateBookmark', () => {
    it('updates bookmark title', async () => {
      const mockBookmark = {
        id: '1',
        title: 'Updated Title',
        url: 'https://example.com',
      };

      mockMockDataService.updateBookmark.mockResolvedValue(mockBookmark);

      const result = await mockMockDataService.updateBookmark('1', {
        title: 'Updated Title',
      });

      expect(mockMockDataService.updateBookmark).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
      });
      expect(result).toBe(mockBookmark);
    });

    it('updates bookmark URL', async () => {
      const mockBookmark = {
        id: '1',
        title: 'Test',
        url: 'https://updated.com',
      };

      mockMockDataService.updateBookmark.mockResolvedValue(mockBookmark);

      const result = await mockMockDataService.updateBookmark('1', {
        url: 'https://updated.com',
      });

      expect(mockMockDataService.updateBookmark).toHaveBeenCalledWith('1', {
        url: 'https://updated.com',
      });
      expect(result).toBe(mockBookmark);
    });

    it('throws error when bookmark not found', async () => {
      mockMockDataService.updateBookmark.mockRejectedValue(new Error('Bookmark with id 999 not found'));

      await expect(
        mockMockDataService.updateBookmark('999', {
          title: 'Updated',
        })
      ).rejects.toThrow('Bookmark with id 999 not found');
    });
  });

  describe('removeBookmark', () => {
    it('removes bookmark', async () => {
      mockMockDataService.removeBookmark.mockResolvedValue(undefined);

      await mockMockDataService.removeBookmark('1');

      expect(mockMockDataService.removeBookmark).toHaveBeenCalledWith('1');
    });
  });

  describe('moveBookmark', () => {
    it('moves bookmark to new parent', async () => {
      mockMockDataService.moveBookmark.mockResolvedValue(undefined);

      await mockMockDataService.moveBookmark('2', '1', 0);

      expect(mockMockDataService.moveBookmark).toHaveBeenCalledWith('2', '1', 0);
    });

    it('throws error when bookmark not found', async () => {
      mockMockDataService.moveBookmark.mockRejectedValue(new Error('Bookmark with id 999 not found'));

      await expect(mockMockDataService.moveBookmark('999', '1')).rejects.toThrow('Bookmark with id 999 not found');
    });
  });

  describe('searchBookmarks', () => {
    it('searches bookmarks by title', async () => {
      const mockResults = [
        {
          id: '1',
          title: 'Google Search',
          url: 'https://google.com',
        },
      ];

      mockMockDataService.searchBookmarks.mockResolvedValue(mockResults);

      const results = await mockMockDataService.searchBookmarks('google');

      expect(mockMockDataService.searchBookmarks).toHaveBeenCalledWith('google');
      expect(results).toBe(mockResults);
    });

    it('searches bookmarks by URL', async () => {
      const mockResults = [
        {
          id: '2',
          title: 'Bing',
          url: 'https://bing.com',
        },
      ];

      mockMockDataService.searchBookmarks.mockResolvedValue(mockResults);

      const results = await mockMockDataService.searchBookmarks('bing.com');

      expect(mockMockDataService.searchBookmarks).toHaveBeenCalledWith('bing.com');
      expect(results).toBe(mockResults);
    });

    it('returns empty array when no matches', async () => {
      mockMockDataService.searchBookmarks.mockResolvedValue([]);

      const results = await mockMockDataService.searchBookmarks('nonexistent');

      expect(results).toStrictEqual([]);
    });

    it('searches case-insensitively', async () => {
      const mockResults = [
        {
          id: '1',
          title: 'Google Search',
          url: 'https://google.com',
        },
      ];

      mockMockDataService.searchBookmarks.mockResolvedValue(mockResults);

      const results = await mockMockDataService.searchBookmarks('GOOGLE');

      expect(mockMockDataService.searchBookmarks).toHaveBeenCalledWith('GOOGLE');
      expect(results).toBe(mockResults);
    });
  });

  describe('getBookmark', () => {
    it('returns bookmark when found', async () => {
      const mockBookmark = {
        id: '1',
        title: 'Test Bookmark',
        url: 'https://example.com',
      };

      mockMockDataService.getBookmark.mockResolvedValue(mockBookmark);

      const result = await mockMockDataService.getBookmark('1');

      expect(mockMockDataService.getBookmark).toHaveBeenCalledWith('1');
      expect(result).toBe(mockBookmark);
    });

    it('returns null when bookmark not found', async () => {
      mockMockDataService.getBookmark.mockResolvedValue(null);

      const result = await mockMockDataService.getBookmark('999');

      expect(result).toBeNull();
    });
  });

  describe('reorderItems', () => {
    it('reorders items in a folder', async () => {
      mockMockDataService.reorderItems.mockResolvedValue(undefined);

      await mockMockDataService.reorderItems('1', 0, 2);

      expect(mockMockDataService.reorderItems).toHaveBeenCalledWith('1', 0, 2);
    });

    it('throws error when folder not found', async () => {
      mockMockDataService.reorderItems.mockRejectedValue(new Error('Folder with id 999 not found or has no children'));

      await expect(mockMockDataService.reorderItems('999', 0, 1)).rejects.toThrow('Folder with id 999 not found or has no children');
    });

    it('throws error when folder has no children', async () => {
      mockMockDataService.reorderItems.mockRejectedValue(new Error('Folder with id 1 not found or has no children'));

      await expect(mockMockDataService.reorderItems('1', 0, 1)).rejects.toThrow('Folder with id 1 not found or has no children');
    });
  });

  describe('reset', () => {
    it('resets to initial mock data', () => {
      mockMockDataService.reset();

      expect(mockMockDataService.reset).toHaveBeenCalledTimes(1);
    });
  });
});
