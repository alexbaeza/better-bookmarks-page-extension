import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkOrderingService } from '@/features/bookmarks/lib/ordering-service';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

const makeFolder = (id: string, children: string[] = []): IBookmarkItem => {
  return {
    children: children.map((cid) => ({ id: cid, title: cid }) as unknown as IBookmarkItem),
    id,
    title: id,
  };
};

describe('orderingService', () => {
  let service: BookmarkOrderingService;

  beforeEach(() => {
    localStorage.clear();
    service = new BookmarkOrderingService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes and applies ordering', () => {
    const folder = makeFolder('f1', ['a', 'b', 'c']);
    service.initializeOrdering([folder]);

    const applied = service.applyOrdering([folder])[0];
    expect(applied.children?.map((c) => c.id)).toStrictEqual(['a', 'b', 'c']);
  });

  it('reorders within a folder deterministically', () => {
    const folder = makeFolder('f1', ['a', 'b', 'c']);
    service.initializeOrdering([folder]);

    service.reorderItems('f1', 0, 2);
    const applied = service.applyOrdering([folder])[0];
    expect(applied.children?.map((c) => c.id)).toStrictEqual(['b', 'c', 'a']);
  });

  it('moves between folders and respects index', () => {
    const f1 = makeFolder('f1', ['a', 'b']);
    const f2 = makeFolder('f2', ['x', 'y']);
    service.initializeOrdering([f1, f2]);

    service.moveItem('a', 'f1', 'f2', 1);

    const updatedF1 = makeFolder('f1', ['b']);
    const updatedF2 = makeFolder('f2', ['x', 'a', 'y']);

    const [appliedF1, appliedF2] = service.applyOrdering([updatedF1, updatedF2]);
    expect(appliedF1.children?.map((c) => c.id)).toStrictEqual(['b']);
    expect(appliedF2.children?.map((c) => c.id)).toStrictEqual(['x', 'a', 'y']);
  });

  it('dedupes when moving an already-present id into destination', () => {
    const f1 = makeFolder('f1', ['a']);
    const f2 = makeFolder('f2', ['a', 'b']);
    service.initializeOrdering([f1, f2]);

    service.moveItem('a', 'f1', 'f2', 0);
    service.moveItem('a', 'f1', 'f2', 2);
    const [, appliedF2] = service.applyOrdering([f1, f2]);
    expect(appliedF2.children?.filter((c) => c.id === 'a').length).toBe(1);
  });

  it('moveItem creates ordering for destination folder when it does not exist', () => {
    const f1 = makeFolder('f1', ['a']);
    service.initializeOrdering([f1]);

    service.moveItem('a', 'f1', 'new-folder', 0);

    expect(service.getOrder('new-folder')).toStrictEqual(['a']);
  });

  it('moveItem handles empty fromFolderId', () => {
    const f2 = makeFolder('f2', ['x']);
    service.initializeOrdering([f2]);

    service.moveItem('a', '', 'f2', 0);

    expect(service.getOrder('f2')).toContain('a');
  });

  it('moveItem handles fromFolderId with no ordering', () => {
    const f1 = makeFolder('f1', ['a']);
    const f2 = makeFolder('f2', ['x']);
    service.initializeOrdering([f1, f2]);

    (service as unknown as { ordering: Record<string, string[]> }).ordering.f1 = undefined as unknown as string[];

    service.moveItem('a', 'f1', 'f2', 0);

    expect(service.getOrder('f2')).toContain('a');
  });

  it('moveItem handles null fromFolderId', () => {
    const f2 = makeFolder('f2', ['x']);
    service.initializeOrdering([f2]);

    service.moveItem('a', null as unknown as string, 'f2', 0);

    expect(service.getOrder('f2')).toContain('a');
  });

  it('reorderItems logs and ignores invalid fromIndex', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const folderId = 'f1';
    const originalOrder = ['a', 'b'];

    service.setOrder(folderId, originalOrder);

    service.reorderItems(folderId, -1, 1);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(service.getOrder(folderId)).toStrictEqual(originalOrder);
  });

  it('reorderItems logs and ignores invalid toIndex', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const folderId = 'f1';

    service.setOrder(folderId, ['a', 'b']);

    service.reorderItems(folderId, 0, 10);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(service.getOrder(folderId)).toStrictEqual(['a', 'b']);
  });

  it('reorderItems logs when no item exists at fromIndex', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const folderId = 'f1';

    (service as unknown as { ordering: Record<string, unknown[]> }).ordering[folderId] = [undefined] as unknown[];

    service.reorderItems(folderId, 0, 0);

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('reorderItems returns early when folder has no ordering', () => {
    const folderId = 'f1';
    const beforeOrder = service.getOrder(folderId);

    service.reorderItems(folderId, 0, 1);

    expect(service.getOrder(folderId)).toStrictEqual(beforeOrder);
  });

  it('cleanupStaleOrdering removes ordering for empty folders', () => {
    const folder = makeFolder('f1', []);
    service.setOrder('f1', ['a', 'b']);

    service.cleanupStaleOrdering(folder);

    expect(service.getOrder('f1')).toStrictEqual([]);
  });

  it('cleanupStaleOrdering does nothing when empty folder has no ordering', () => {
    const folder = makeFolder('f1', []);

    service.cleanupStaleOrdering(folder);

    expect(service.getOrder('f1')).toStrictEqual([]);
  });

  it('cleanupStaleOrdering keeps valid ids and removes stale ones', () => {
    const folder = makeFolder('f1', ['a', 'b']);
    service.setOrder('f1', ['a', 'stale', 'b']);

    service.cleanupStaleOrdering(folder);

    expect(service.getOrder('f1')).toStrictEqual(['a', 'b']);
  });

  it('cleanupStaleOrdering returns early when folder has no ordering', () => {
    const folder = makeFolder('f1', ['a', 'b']);

    service.cleanupStaleOrdering(folder);

    expect(service.getOrder('f1')).toStrictEqual([]);
  });

  it('cleanupStaleOrdering does not update when no stale entries are found', () => {
    const folder = makeFolder('f1', ['a', 'b']);
    service.setOrder('f1', ['a', 'b']);

    service.cleanupStaleOrdering(folder);

    expect(service.getOrder('f1')).toStrictEqual(['a', 'b']);
  });

  it('getOrderedChildren cleans up ordering for empty folder and returns children', () => {
    const folder = makeFolder('f1', []);
    service.setOrder('f1', ['a']);

    const children = service.getOrderedChildren(folder);

    expect(children).toStrictEqual([]);
    expect(service.getOrder('f1')).toStrictEqual([]);
  });

  it('getOrderedChildren applies stored ordering and cleans up stale and duplicate ids', () => {
    const folder: IBookmarkItem = {
      id: 'f1',
      title: 'f1',
      children: [
        { id: 'a', title: 'a' } as IBookmarkItem,
        { id: 'b', title: 'b' } as IBookmarkItem,
        { id: 'c', title: 'c' } as IBookmarkItem,
      ],
    };

    service.setOrder('f1', ['c', 'stale', 'a', 'a']);

    const orderedChildren = service.getOrderedChildren(folder);

    expect(orderedChildren?.map((c) => c.id)).toStrictEqual(['c', 'a', 'b']);
    expect(service.getOrder('f1')).toStrictEqual(['c', 'a', 'b']);
  });

  it('initializeOrdering sets ordering for nested folder structures and reconciles new children', () => {
    const nestedChild: IBookmarkItem = {
      id: 'child-1',
      title: 'child-1',
      children: [
        { id: 'grandchild-1', title: 'grandchild-1' } as IBookmarkItem,
        { id: 'grandchild-2', title: 'grandchild-2' } as IBookmarkItem,
      ],
    };

    const root: IBookmarkItem = {
      id: 'root',
      title: 'root',
      children: [nestedChild],
    };

    service.initializeOrdering([root]);

    expect(service.getOrder('root')).toStrictEqual(['child-1']);
    expect(service.getOrder('child-1')).toStrictEqual(['grandchild-1', 'grandchild-2']);

    const extendedChild = {
      ...nestedChild,
      children: [...(nestedChild.children ?? []), { id: 'grandchild-3', title: 'grandchild-3' } as IBookmarkItem],
    };

    const updatedRoot = {
      ...root,
      children: [extendedChild],
    };

    service.initializeOrdering([updatedRoot]);

    expect(service.getOrder('child-1')).toStrictEqual(['grandchild-1', 'grandchild-2', 'grandchild-3']);
  });

  it('initializeOrdering skips folders with no children', () => {
    const emptyFolder: IBookmarkItem = {
      id: 'empty',
      title: 'empty',
      children: [],
    };

    service.initializeOrdering([emptyFolder]);

    expect(service.getOrder('empty')).toStrictEqual([]);
  });

  it('reconcileFolderOrdering guard clause handles empty child folder during recursion', () => {
    const emptyNestedFolder: IBookmarkItem = {
      id: 'empty-nested',
      title: 'empty-nested',
      children: [],
    };

    const parentFolder: IBookmarkItem = {
      id: 'parent',
      title: 'parent',
      children: [
        {
          id: 'child-with-empty',
          title: 'child-with-empty',
          children: [emptyNestedFolder],
        } as IBookmarkItem,
      ],
    };

    service.initializeOrdering([parentFolder]);

    expect(service.getOrder('parent')).toStrictEqual(['child-with-empty']);
    expect(service.getOrder('child-with-empty')).toStrictEqual(['empty-nested']);
    expect(service.getOrder('empty-nested')).toStrictEqual([]);
  });

  it('reconcileFolderOrdering guard clause handles child folder with undefined children during recursion', () => {
    const folderWithUndefinedChildren: IBookmarkItem = {
      id: 'undefined-children',
      title: 'undefined-children',
      children: undefined,
    };

    const parentFolder: IBookmarkItem = {
      id: 'parent',
      title: 'parent',
      children: [
        {
          id: 'child-with-undefined',
          title: 'child-with-undefined',
          children: [folderWithUndefinedChildren],
        } as IBookmarkItem,
      ],
    };

    service.initializeOrdering([parentFolder]);

    expect(service.getOrder('parent')).toStrictEqual(['child-with-undefined']);
    expect(service.getOrder('child-with-undefined')).toStrictEqual(['undefined-children']);
    expect(service.getOrder('undefined-children')).toStrictEqual([]);
  });

  it('reconcileFolderOrdering handles child folders without children property', () => {
    const bookmarkChild: IBookmarkItem = {
      id: 'bookmark-1',
      title: 'bookmark-1',
      url: 'https://example.com',
    };

    const parentFolder: IBookmarkItem = {
      id: 'parent',
      title: 'parent',
      children: [
        {
          id: 'folder-with-bookmark',
          title: 'folder-with-bookmark',
          children: [bookmarkChild],
        } as IBookmarkItem,
      ],
    };

    service.initializeOrdering([parentFolder]);

    expect(service.getOrder('parent')).toStrictEqual(['folder-with-bookmark']);
    expect(service.getOrder('folder-with-bookmark')).toStrictEqual(['bookmark-1']);
  });

  it('cleanupEmptyFolderOrdering returns early when folder has no ordering', () => {
    const folder: IBookmarkItem = {
      id: 'f1',
      title: 'f1',
      children: [],
    };

    service.getOrderedChildren(folder);

    expect(service.getOrder('f1')).toStrictEqual([]);
  });

  it('initializeOrdering reconciles existing ordering when no new items are added', () => {
    const folder: IBookmarkItem = {
      id: 'f1',
      title: 'f1',
      children: [{ id: 'a', title: 'a' } as IBookmarkItem, { id: 'b', title: 'b' } as IBookmarkItem],
    };

    service.setOrder('f1', ['a', 'b']);
    service.initializeOrdering([folder]);

    expect(service.getOrder('f1')).toStrictEqual(['a', 'b']);
  });

  it('getOrderedChildren does not update ordering when no stale entries are detected', () => {
    const folder: IBookmarkItem = {
      id: 'f1',
      title: 'f1',
      children: [{ id: 'a', title: 'a' } as IBookmarkItem, { id: 'b', title: 'b' } as IBookmarkItem],
    };

    service.setOrder('f1', ['a', 'b']);
    const orderedChildren = service.getOrderedChildren(folder);

    expect(orderedChildren?.map((c) => c.id)).toStrictEqual(['a', 'b']);
    expect(service.getOrder('f1')).toStrictEqual(['a', 'b']);
  });

  it('getOrderedChildren handles folder with undefined children', () => {
    const folder: IBookmarkItem = {
      id: 'f1',
      title: 'f1',
      children: undefined,
    };

    const orderedChildren = service.getOrderedChildren(folder);

    expect(orderedChildren).toBeUndefined();
  });

  it('getOrderedChildren calls cleanupEmptyFolderOrdering for empty folder with ordering', () => {
    const folder: IBookmarkItem = {
      id: 'f1',
      title: 'f1',
      children: [],
    };

    service.setOrder('f1', ['a']);

    const orderedChildren = service.getOrderedChildren(folder);

    expect(orderedChildren).toStrictEqual([]);
    expect(service.getOrder('f1')).toStrictEqual([]);
  });

  it('loads ordering from localStorage when stored value is null', () => {
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => null);
    localStorage.clear();
    const testService = new BookmarkOrderingService();

    expect(testService.getOrder('any-folder')).toStrictEqual([]);

    getItemSpy.mockRestore();
  });

  it('setOrder persists ordering to localStorage and handles storage errors gracefully', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    service.setOrder('f1', ['a']);

    expect(setItemSpy).toHaveBeenCalledTimes(1);

    const error = new Error('storage failed');
    setItemSpy.mockImplementation(() => {
      throw error;
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    service.setOrder('f1', ['b']);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('loads ordering from localStorage on construction when data is valid', () => {
    const storageKeyPrefix = 'bookmark-ordering';

    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation((key: string) => {
      if (key.includes(storageKeyPrefix)) {
        return JSON.stringify({ persisted: ['x'] });
      }
      return null;
    });

    localStorage.clear();
    const testService = new BookmarkOrderingService();

    expect(testService.getOrder('persisted')).toStrictEqual(['x']);

    getItemSpy.mockRestore();
  });

  it('resets ordering when loading from localStorage throws', () => {
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('bad json');
    });

    localStorage.clear();
    const testService = new BookmarkOrderingService();

    expect(testService.getOrder('any-folder')).toStrictEqual([]);

    getItemSpy.mockRestore();
  });
});
