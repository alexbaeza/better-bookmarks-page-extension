import type { IBookmarkItem } from '@/shared/types/bookmarks';

export const findFolderById = (folders: IBookmarkItem[], id: string | null): IBookmarkItem | undefined => {
  if (!id) return undefined;
  for (const f of folders) {
    if (f.id === id) return f;
    if (f.children) {
      const found = findFolderById(f.children, id);
      if (found) return found;
    }
  }
};

export const countItems = (f: IBookmarkItem) => f.children?.filter((c) => !Array.isArray(c.children)).length || 0;

export const countFolders = (f: IBookmarkItem) => f.children?.filter((c) => Array.isArray(c.children)).length || 0;

export const onlyFolders = (f: IBookmarkItem) => Array.isArray(f.children);
