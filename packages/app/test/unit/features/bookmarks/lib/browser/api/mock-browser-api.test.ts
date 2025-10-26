import { vi } from 'vitest';

import { MockBrowserAPI } from '@/features/bookmarks/lib/browser/api/mock-browser-api';
import { mockDataService } from '@/features/bookmarks/lib/browser/api/mock-data-service';

vi.mock('@/features/bookmarks/lib/browser/api/mock-data-service', () => ({
  mockDataService: {
    createBookmark: vi.fn(),
    getBookmark: vi.fn(),
    getData: vi.fn(),
    moveBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    reorderItems: vi.fn(),
    searchBookmarks: vi.fn(),
    updateBookmark: vi.fn(),
  },
}));

describe('MockBrowserAPI', () => {
  let api: MockBrowserAPI;
  let mockMockDataService: ReturnType<typeof vi.mocked<typeof mockDataService>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMockDataService = vi.mocked(mockDataService);
    api = new MockBrowserAPI();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getBookmarksTree', () => {
    it('returns normalized bookmark tree from mock data service', async () => {
      const mockData = [
        {
          children: [
            {
              children: [
                {
                  children: [
                    {
                      id: '3',
                      parentId: '2',
                      title: 'Bookmark 1',
                      url: 'https://example.com',
                    },
                  ],
                  id: '2',
                  parentId: '1',
                  title: 'Test Folder',
                },
                {
                  id: '4',
                  parentId: '1',
                  title: 'Loose Bookmark',
                  url: 'https://example.com/loose',
                },
              ],
              id: '1',
              title: 'Bookmarks Menu',
            },
          ],
          id: '0',
          title: 'Root',
        },
      ];

      mockMockDataService.getData.mockReturnValue(mockData);

      const result = await api.getBookmarksTree();

      expect(mockMockDataService.getData).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('folders');
      expect(result).toHaveProperty('uncategorized');
      expect(Array.isArray(result.folders)).toBe(true);
      expect(result.uncategorized === undefined || typeof result.uncategorized === 'object').toBe(true);
      expect(result.folders[0]).toBeDefined();
      expect(result.folders[0].title).toBe('Test Folder');
    });
  });

  describe('createBookmark', () => {
    it('creates a bookmark via mock data service', async () => {
      const mockBookmark = {
        id: '3',
        parentId: '1',
        title: 'New Bookmark',
        url: 'https://example.com',
      };

      mockMockDataService.createBookmark.mockResolvedValue(mockBookmark);

      const result = await api.createBookmark('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });

      expect(mockMockDataService.createBookmark).toHaveBeenCalledWith('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });
      expect(result.id).toBe('3');
      expect(result.title).toBe('New Bookmark');
      expect(result.url).toBe('https://example.com');
    });

    it('creates a folder via mock data service', async () => {
      const mockFolder = {
        id: '4',
        parentId: '1',
        title: 'New Folder',
      };

      mockMockDataService.createBookmark.mockResolvedValue(mockFolder);

      const result = await api.createBookmark('1', {
        title: 'New Folder',
      });

      expect(mockMockDataService.createBookmark).toHaveBeenCalledWith('1', {
        title: 'New Folder',
      });
      expect(result.id).toBe('4');
      expect(result.title).toBe('New Folder');
      expect(result.url).toBeUndefined();
    });
  });

  describe('removeBookmark', () => {
    it('removes a bookmark via mock data service', async () => {
      mockMockDataService.removeBookmark.mockResolvedValue(undefined);

      await api.removeBookmark('2');

      expect(mockMockDataService.removeBookmark).toHaveBeenCalledWith('2');
    });
  });

  describe('updateBookmark', () => {
    it('updates a bookmark via mock data service', async () => {
      const mockBookmark = {
        id: '2',
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      };

      mockMockDataService.updateBookmark.mockResolvedValue(mockBookmark);

      const result = await api.updateBookmark('2', {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      });

      expect(mockMockDataService.updateBookmark).toHaveBeenCalledWith('2', {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      });
      expect(result.id).toBe('2');
      expect(result.title).toBe('Updated Bookmark');
      expect(result.url).toBe('https://updated.com');
    });
  });

  describe('moveBookmark', () => {
    it('moves a bookmark via mock data service', async () => {
      mockMockDataService.moveBookmark.mockResolvedValue(undefined);

      await api.moveBookmark('2', '3');

      expect(mockMockDataService.moveBookmark).toHaveBeenCalledWith('2', '3', undefined);
    });

    it('moves a bookmark with index via mock data service', async () => {
      mockMockDataService.moveBookmark.mockResolvedValue(undefined);

      await api.moveBookmark('2', '3', 1);

      expect(mockMockDataService.moveBookmark).toHaveBeenCalledWith('2', '3', 1);
    });
  });

  describe('getBookmark', () => {
    it('returns bookmark when found via mock data service', async () => {
      const mockBookmark = {
        id: '2',
        title: 'Test Bookmark',
        url: 'https://example.com',
      };

      mockMockDataService.getBookmark.mockResolvedValue(mockBookmark);

      const result = await api.getBookmark('2');

      expect(mockMockDataService.getBookmark).toHaveBeenCalledWith('2');
      expect(result?.id).toBe('2');
      expect(result?.title).toBe('Test Bookmark');
      expect(result?.url).toBe('https://example.com');
    });

    it('returns null when bookmark not found via mock data service', async () => {
      mockMockDataService.getBookmark.mockResolvedValue(null);

      const result = await api.getBookmark('999');

      expect(result).toBeNull();
    });
  });

  describe('searchBookmarks', () => {
    it('searches bookmarks via mock data service', async () => {
      const mockResults = [
        {
          id: '2',
          title: 'Google Search',
          url: 'https://google.com',
        },
        {
          id: '3',
          title: 'Google Maps',
          url: 'https://maps.google.com',
        },
      ];

      mockMockDataService.searchBookmarks.mockResolvedValue(mockResults);

      const result = await api.searchBookmarks('google');

      expect(mockMockDataService.searchBookmarks).toHaveBeenCalledWith('google');
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Google Search');
      expect(result[1].title).toBe('Google Maps');
    });

    it('returns empty array when no results via mock data service', async () => {
      mockMockDataService.searchBookmarks.mockResolvedValue([]);

      const result = await api.searchBookmarks('nonexistent');

      expect(result).toHaveLength(0);
    });
  });

  describe('reorderItems', () => {
    it('reorders items in a folder via mock data service', async () => {
      mockMockDataService.reorderItems.mockResolvedValue(undefined);

      await api.reorderItems('1', 0, 2);

      expect(mockMockDataService.reorderItems).toHaveBeenCalledWith('1', 0, 2);
    });
  });
});
