import { describe, expect, it, vi } from 'vitest';
import { BookmarkPage } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { getPageContainers } from '@/shared/utils/bookmark-search-utils';

vi.mock('@/features/bookmarks/lib/browser/utils/bookmark-tree-utils', () => ({
  findFolderById: vi.fn(),
}));

vi.mock('@/shared/utils/page-utils', () => ({
  isAllPage: (pageId: string) => pageId === BookmarkPage.All,
  isUncategorizedPage: (pageId: string) => pageId === BookmarkPage.Uncategorized,
}));

describe('bookmark-search-utils', () => {
  describe('getPageContainers', () => {
    const mockRawFolders: IBookmarkItem[] = [
      {
        children: [],
        id: 'folder-1',
        title: 'Folder 1',
      },
      {
        children: [],
        id: 'folder-2',
        title: 'Folder 2',
      },
    ];

    const mockUncategorized: IBookmarkItem = {
      children: [],
      id: 'uncategorized',
      title: 'Uncategorized',
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return all folders for "All" page', () => {
      const result = getPageContainers(BookmarkPage.All, mockRawFolders, mockUncategorized);
      expect(result).toEqual(mockRawFolders);
    });

    it('should return uncategorized folder when it exists for "Uncategorized" page', () => {
      const result = getPageContainers(BookmarkPage.Uncategorized, mockRawFolders, mockUncategorized);
      expect(result).toEqual([mockUncategorized]);
    });

    it('should return empty array when uncategorized is undefined for "Uncategorized" page', () => {
      const result = getPageContainers(BookmarkPage.Uncategorized, mockRawFolders, undefined);
      expect(result).toEqual([]);
    });

    it('should return folder when found for specific folder page', () => {
      const targetFolder: IBookmarkItem = {
        children: [],
        id: 'folder-1',
        title: 'Folder 1',
      };
      const mockFindFolderById = vi.mocked(findFolderById);
      mockFindFolderById.mockReturnValue(targetFolder);

      const result = getPageContainers('folder-1', mockRawFolders, mockUncategorized);
      expect(result).toEqual([targetFolder]);
      expect(mockFindFolderById).toHaveBeenCalledWith(mockRawFolders, 'folder-1');
    });

    it('should return empty array when folder is not found for specific folder page', () => {
      const mockFindFolderById = vi.mocked(findFolderById);
      mockFindFolderById.mockReturnValue(undefined);

      const result = getPageContainers('non-existent-folder', mockRawFolders, mockUncategorized);
      expect(result).toEqual([]);
      expect(mockFindFolderById).toHaveBeenCalledWith(mockRawFolders, 'non-existent-folder');
    });

    it('should handle empty folders array for "All" page', () => {
      const result = getPageContainers(BookmarkPage.All, [], mockUncategorized);
      expect(result).toEqual([]);
    });
  });
});
