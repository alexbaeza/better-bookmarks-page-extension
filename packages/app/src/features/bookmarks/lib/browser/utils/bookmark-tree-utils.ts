import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { isBookmarkFolder } from '@/shared/utils/bookmark-utils';

export const findItemById = (tree: IBookmarkItem[], id: string): IBookmarkItem | null => {
  for (const item of tree) {
    if (item.id === id) return item;
    if (item.children) {
      const res = findItemById(item.children, id);
      if (res) return res;
    }
  }
  return null;
};

export const findParentOfItem = (tree: IBookmarkItem[], id: string): IBookmarkItem | null => {
  for (const item of tree) {
    if (item.children?.some((child) => child.id === id)) return item;
    if (item.children) {
      const res = findParentOfItem(item.children, id);
      if (res) return res;
    }
  }
  return null;
};

export const updateChildrenInTree = (
  tree: IBookmarkItem[],
  parentId: string,
  newChildren: IBookmarkItem[]
): IBookmarkItem[] => {
  return tree.map((item) => {
    if (item.id === parentId) {
      return { ...item, children: newChildren };
    }
    if (item.children) {
      return {
        ...item,
        children: updateChildrenInTree(item.children, parentId, newChildren),
      };
    }
    return item;
  });
};

export const findFolderById = (folders: IBookmarkItem[], id: string | null): IBookmarkItem | undefined => {
  if (!id) return undefined;
  for (const folder of folders) {
    if (folder.id === id) return folder;
    if (isBookmarkFolder(folder) && folder.children) {
      const found = findFolderById(folder.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const countItems = (folder: IBookmarkItem) =>
  folder.children?.filter((child) => !isBookmarkFolder(child)).length || 0;

export const countFolders = (folder: IBookmarkItem) =>
  folder.children?.filter((child) => isBookmarkFolder(child)).length || 0;

export const onlyFolders = (folder: IBookmarkItem) => isBookmarkFolder(folder);

/**
 * Build the path from root to a folder by finding all ancestors
 * Returns an array of folder IDs from root to the target folder
 */
export const buildPathToFolder = (tree: IBookmarkItem[], targetId: string): string[] => {
  const path: string[] = [];

  const findPath = (items: IBookmarkItem[], target: string, currentPath: string[]): boolean => {
    for (const item of items) {
      const newPath = [...currentPath, item.id];

      if (item.id === target) {
        path.push(...newPath);
        return true;
      }

      if (item.children) {
        if (findPath(item.children, target, newPath)) {
          return true;
        }
      }
    }
    return false;
  };

  findPath(tree, targetId, []);
  return path;
};
