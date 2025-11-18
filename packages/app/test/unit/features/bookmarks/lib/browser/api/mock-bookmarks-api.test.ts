import { beforeEach, describe, expect, it } from 'vitest';
import { MockBookmarksAPI } from '@/features/bookmarks/lib/browser/api/mock-bookmarks-api';

const getFirstFolderChildren = (nodes: Array<{ children?: any[] }>): any[] => {
  const folder = nodes[0];
  if (!folder?.children) {
    throw new Error('Test setup error: expected folder with children');
  }
  return folder.children;
};

const findChildByTitle = (nodes: Array<{ children?: any[] }>, title: string): any => {
  const children = getFirstFolderChildren(nodes);
  const child = children.find((c) => c.title === title);
  if (!child) {
    throw new Error(`Test setup error: expected child with title "${title}"`);
  }
  return child;
};

describe('MockBookmarksAPI', () => {
  describe('Chrome API behavior', () => {
    let api: MockBookmarksAPI;
    let testFolderId: string;

    beforeEach(async () => {
      api = new MockBookmarksAPI('chrome');

      // Create a test folder with 4 bookmarks: A, B, C, D
      const testFolder = (await api.create({
        title: 'Test Folder',
        parentId: '1', // Bookmarks Bar in Chrome
      })) as chrome.bookmarks.BookmarkTreeNode;

      testFolderId = testFolder.id;

      // Create bookmarks A, B, C, D
      for (const letter of ['A', 'B', 'C', 'D']) {
        await api.create({
          title: letter,
          url: `https://example.com/${letter.toLowerCase()}`,
          parentId: testFolderId,
        });
      }
    });

    describe('move() - same folder reordering', () => {
      it('should move item down correctly (B from index 1 to index 3)', async () => {
        // Initial: [A, B, C, D] (indices 0, 1, 2, 3)
        const initialFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        expect(initialChildren.map((c) => c.title)).toEqual(['A', 'B', 'C', 'D']);

        const bookmarkB = initialChildren[1];

        // Move B to index 3
        // Expected real API behavior: B ends up at index 3
        // Result: [A, C, D, B]
        await api.move(bookmarkB.id, { index: 3 });

        const resultFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);

        expect(resultChildren.map((c) => c.title)).toEqual(['A', 'C', 'D', 'B']);
        expect(resultChildren.findIndex((c) => c.title === 'B')).toBe(3);
      });

      it('should move item up correctly (C from index 2 to index 0)', async () => {
        // Initial: [A, B, C, D] (indices 0, 1, 2, 3)
        const initialFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        expect(initialChildren.map((c) => c.title)).toEqual(['A', 'B', 'C', 'D']);

        const bookmarkC = initialChildren[2];

        // Move C to index 0
        // Expected real API behavior: C ends up at index 0
        // Result: [C, A, B, D]
        await api.move(bookmarkC.id, { index: 0 });

        const resultFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);

        expect(resultChildren.map((c) => c.title)).toEqual(['C', 'A', 'B', 'D']);
        expect(resultChildren.findIndex((c) => c.title === 'C')).toBe(0);
      });

      it('should handle moving to same position (no-op)', async () => {
        const initialFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        const bookmarkB = initialChildren[1];

        // Move B to its current position (index 1)
        await api.move(bookmarkB.id, { index: 1 });

        const resultFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);

        // Order should remain unchanged
        expect(resultChildren.map((c) => c.title)).toEqual(['A', 'B', 'C', 'D']);
      });

      it('should move item to last position (D from index 3 to index 3 after moving B)', async () => {
        const initialFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        const bookmarkB = initialChildren[1];

        // Move B to index 3: [A, B, C, D] -> [A, C, D, B]
        await api.move(bookmarkB.id, { index: 3 });

        const folder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkA = findChildByTitle(folder, 'A');

        // Move A to index 3 (last position): [A, C, D, B] -> [C, D, B, A]
        await api.move(bookmarkA.id, { index: 3 });

        const resultFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);

        expect(resultChildren.map((c) => c.title)).toEqual(['C', 'D', 'B', 'A']);
      });

      it('should move middle item to middle position (B from 1 to 2)', async () => {
        // Initial: [A, B, C, D]
        const initialFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        const bookmarkB = initialChildren[1];

        // Move B to index 2: [A, B, C, D] -> [A, C, B, D]
        await api.move(bookmarkB.id, { index: 2 });

        const resultFolder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);

        expect(resultChildren.map((c) => c.title)).toEqual(['A', 'C', 'B', 'D']);
        expect(resultChildren.findIndex((c) => c.title === 'B')).toBe(2);
      });

      it('should handle multiple sequential moves correctly', async () => {
        // Initial: [A, B, C, D]
        const folder1 = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkA = findChildByTitle(folder1, 'A');
        const bookmarkB = findChildByTitle(folder1, 'B');

        // Move A to index 2: [A, B, C, D] -> [B, C, A, D]
        await api.move(bookmarkA.id, { index: 2 });

        let result = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const firstResultChildren = getFirstFolderChildren(result);
        expect(firstResultChildren.map((c) => c.title)).toEqual(['B', 'C', 'A', 'D']);

        // Move B to index 3: [B, C, A, D] -> [C, A, D, B]
        await api.move(bookmarkB.id, { index: 3 });

        result = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const secondResultChildren = getFirstFolderChildren(result);
        expect(secondResultChildren.map((c) => c.title)).toEqual(['C', 'A', 'D', 'B']);
      });

      it('should handle moving last item to first position', async () => {
        // Initial: [A, B, C, D]
        const folder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkD = findChildByTitle(folder, 'D');

        // Move D to index 0: [A, B, C, D] -> [D, A, B, C]
        await api.move(bookmarkD.id, { index: 0 });

        const result = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(result);
        expect(resultChildren.map((c) => c.title)).toEqual(['D', 'A', 'B', 'C']);
      });

      it('should handle moving first item to last position', async () => {
        // Initial: [A, B, C, D]
        const folder = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkA = findChildByTitle(folder, 'A');

        // Move A to index 3: [A, B, C, D] -> [B, C, D, A]
        await api.move(bookmarkA.id, { index: 3 });

        const result = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(result);
        expect(resultChildren.map((c) => c.title)).toEqual(['B', 'C', 'D', 'A']);
      });
    });

    describe('move() - cross-folder moves', () => {
      let secondFolderId: string;

      beforeEach(async () => {
        const secondFolder = (await api.create({
          title: 'Second Folder',
          parentId: '1',
        })) as chrome.bookmarks.BookmarkTreeNode;

        secondFolderId = secondFolder.id;

        // Add some bookmarks to second folder
        await api.create({
          title: 'X',
          url: 'https://example.com/x',
          parentId: secondFolderId,
        });
        await api.create({
          title: 'Y',
          url: 'https://example.com/y',
          parentId: secondFolderId,
        });
      });

      it('should move bookmark to different folder at specific index', async () => {
        // Get bookmark B from first folder
        const folder1 = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkB = findChildByTitle(folder1, 'B');

        // Move B to second folder at index 1 (between X and Y)
        await api.move(bookmarkB.id, { parentId: secondFolderId, index: 1 });

        // Check first folder no longer has B
        const result1 = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const result1Children = getFirstFolderChildren(result1);
        expect(result1Children.map((c) => c.title)).toEqual(['A', 'C', 'D']);

        // Check second folder has B at index 1
        const result2 = (await api.getSubTree(secondFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const result2Children = getFirstFolderChildren(result2);
        expect(result2Children.map((c) => c.title)).toEqual(['X', 'B', 'Y']);
      });

      it('should move bookmark to different folder at end (no index specified)', async () => {
        const folder1 = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkB = findChildByTitle(folder1, 'B');

        // Move B to second folder without specifying index (should append)
        await api.move(bookmarkB.id, { parentId: secondFolderId });

        // Check second folder has B at the end
        const result2 = (await api.getSubTree(secondFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const result2Children = getFirstFolderChildren(result2);
        expect(result2Children.map((c) => c.title)).toEqual(['X', 'Y', 'B']);
      });

      it('should move bookmark to different folder at beginning', async () => {
        const folder1 = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkB = findChildByTitle(folder1, 'B');

        // Move B to second folder at index 0
        await api.move(bookmarkB.id, { parentId: secondFolderId, index: 0 });

        // Check second folder has B at the beginning
        const result2 = (await api.getSubTree(secondFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const result2Children = getFirstFolderChildren(result2);
        expect(result2Children.map((c) => c.title)).toEqual(['B', 'X', 'Y']);
      });

      it('should allow reordering within destination folder after cross-folder move', async () => {
        // Move bookmark B from first folder to second folder
        const folder1 = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const bookmarkB = findChildByTitle(folder1, 'B');

        // Move B to second folder (will be at end: [X, Y, B])
        await api.move(bookmarkB.id, { parentId: secondFolderId });

        let result2 = (await api.getSubTree(secondFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        let result2Children = getFirstFolderChildren(result2);
        expect(result2Children.map((c) => c.title)).toEqual(['X', 'Y', 'B']);

        // Now try to reorder B within the second folder (move from index 2 to index 0)
        await api.move(bookmarkB.id, { index: 0 });

        result2 = (await api.getSubTree(secondFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        result2Children = getFirstFolderChildren(result2);
        expect(result2Children.map((c) => c.title)).toEqual(['B', 'X', 'Y']);

        // Try another reorder (move B from index 0 to index 1)
        await api.move(bookmarkB.id, { index: 1 });

        result2 = (await api.getSubTree(secondFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        result2Children = getFirstFolderChildren(result2);
        expect(result2Children.map((c) => c.title)).toEqual(['X', 'B', 'Y']);
      });
    });

    describe('dateGroupModified updates', () => {
      it('should update dateGroupModified when moving items within folder', async () => {
        const folderBefore = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const initialTimestamp = folderBefore[0].dateGroupModified ?? 0;

        // Wait a tiny bit to ensure timestamp changes
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Move an item
        const folderChildrenBefore = getFirstFolderChildren(folderBefore);
        const bookmarkB = folderChildrenBefore[1];
        await api.move(bookmarkB.id, { index: 2 });

        const folderAfter = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const newTimestamp = folderAfter[0].dateGroupModified ?? 0;

        expect(newTimestamp).toBeGreaterThan(initialTimestamp);
      });

      it('should update dateGroupModified for both folders in cross-folder move', async () => {
        // Create second folder
        const secondFolder = (await api.create({
          title: 'Second Folder',
          parentId: '1',
        })) as chrome.bookmarks.BookmarkTreeNode;

        const folder1Before = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const folder2Before = (await api.getSubTree(secondFolder.id)) as chrome.bookmarks.BookmarkTreeNode[];
        const timestamp1Before = folder1Before[0].dateGroupModified ?? 0;
        const timestamp2Before = folder2Before[0].dateGroupModified ?? 0;

        await new Promise((resolve) => setTimeout(resolve, 10));

        // Move bookmark from folder1 to folder2
        const folder1ChildrenBefore = getFirstFolderChildren(folder1Before);
        const bookmarkB = folder1ChildrenBefore[1];
        await api.move(bookmarkB.id, { parentId: secondFolder.id });

        const folder1After = (await api.getSubTree(testFolderId)) as chrome.bookmarks.BookmarkTreeNode[];
        const folder2After = (await api.getSubTree(secondFolder.id)) as chrome.bookmarks.BookmarkTreeNode[];

        expect(folder1After[0].dateGroupModified ?? 0).toBeGreaterThan(timestamp1Before);
        expect(folder2After[0].dateGroupModified ?? 0).toBeGreaterThan(timestamp2Before);
      });
    });
  });

  describe('Firefox API behavior', () => {
    let api: MockBookmarksAPI;
    let testFolderId: string;

    beforeEach(async () => {
      // Ensure we always start from fresh mock data (avoid stale localStorage from other tests)
      localStorage.clear();

      api = new MockBookmarksAPI('firefox');

      // Create a test folder with 4 bookmarks: A, B, C, D under an existing default folder
      const testFolder = (await api.create({
        title: 'Test Folder',
        // Use Bookmarks Menu (menu________), which is guaranteed to exist in firefoxMockData
        parentId: 'menu________',
      })) as browser.bookmarks.BookmarkTreeNode;

      testFolderId = testFolder.id;

      // Create bookmarks A, B, C, D
      for (const letter of ['A', 'B', 'C', 'D']) {
        await api.create({
          title: letter,
          url: `https://example.com/${letter.toLowerCase()}`,
          parentId: testFolderId,
        });
      }
    });

    describe('move() - same folder reordering', () => {
      it('should behave identically to Chrome for moving down', async () => {
        const initialFolder = (await api.getSubTree(testFolderId)) as browser.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        const bookmarkB = initialChildren[1];

        await api.move(bookmarkB.id, { index: 3 });

        const resultFolder = (await api.getSubTree(testFolderId)) as browser.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);
        expect(resultChildren.map((c) => c.title)).toEqual(['A', 'C', 'D', 'B']);
      });

      it('should behave identically to Chrome for moving up', async () => {
        const initialFolder = (await api.getSubTree(testFolderId)) as browser.bookmarks.BookmarkTreeNode[];
        const initialChildren = getFirstFolderChildren(initialFolder);
        const bookmarkC = initialChildren[2];

        await api.move(bookmarkC.id, { index: 0 });

        const resultFolder = (await api.getSubTree(testFolderId)) as browser.bookmarks.BookmarkTreeNode[];
        const resultChildren = getFirstFolderChildren(resultFolder);
        expect(resultChildren.map((c) => c.title)).toEqual(['C', 'A', 'B', 'D']);
      });
    });
  });
});
