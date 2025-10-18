import type { IBookmarkItem } from '@/shared/types/bookmarks';

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
    if (item.children?.some((c) => c.id === id)) return item;
    if (item.children) {
      const res = findParentOfItem(item.children, id);
      if (res) return res;
    }
  }
  return null;
};

export const updateChildrenInTree = (tree: IBookmarkItem[], parentId: string, newChildren: IBookmarkItem[]): IBookmarkItem[] => {
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

export function findFolderById(folders: IBookmarkItem[], id: string | null): IBookmarkItem | undefined {
  if (!id) return undefined;
  for (const f of folders) {
    if (f.id === id) return f;
    if (Array.isArray(f.children)) {
      const found = findFolderById(f.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
