import { storageKey } from '@/app/providers/atoms';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface OrderingData {
  [folderId: string]: string[]; // folderId -> ordered item IDs
}

export interface OrderingService {
  getOrder(folderId: string): string[];
  setOrder(folderId: string, orderedIds: string[]): void;
  moveItem(itemId: string, fromFolderId: string, toFolderId: string, toIndex: number): void;
  reorderItems(folderId: string, fromIndex: number, toIndex: number): void;
  initializeOrdering(bookmarks: IBookmarkItem[]): void;
}

class BookmarkOrderingService implements OrderingService {
  private ordering: OrderingData = {};
  private readonly STORAGE_KEY = storageKey('bookmark-ordering');

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Get the ordered item IDs for a folder
   */
  getOrder(folderId: string): string[] {
    return this.ordering[folderId] || [];
  }

  /**
   * Set the ordered item IDs for a folder
   */
  setOrder(folderId: string, orderedIds: string[]): void {
    this.ordering[folderId] = orderedIds;
    this.saveToStorage();
  }

  /**
   * Move an item from one folder to another at a specific index
   */
  moveItem(itemId: string, fromFolderId: string, toFolderId: string, toIndex: number): void {
    // Remove from source folder
    if (fromFolderId && this.ordering[fromFolderId]) {
      const _beforeRemove = [...this.ordering[fromFolderId]];
      this.ordering[fromFolderId] = this.ordering[fromFolderId].filter((id) => id !== itemId);
    }

    // Add to destination folder at specific index
    if (!this.ordering[toFolderId]) {
      this.ordering[toFolderId] = [];
    }

    // Dedupe in destination before inserting
    const _beforeAdd = [...this.ordering[toFolderId]];
    const withoutItem = this.ordering[toFolderId].filter((id) => id !== itemId);
    const clampedIndex = Math.max(0, Math.min(toIndex, withoutItem.length));
    withoutItem.splice(clampedIndex, 0, itemId);
    this.ordering[toFolderId] = withoutItem;
    this.saveToStorage();
  }

  /**
   * Reorder items within the same folder
   */
  reorderItems(folderId: string, fromIndex: number, toIndex: number): void {
    if (!this.ordering[folderId]) {
      return;
    }

    const beforeReorder = [...this.ordering[folderId]];
    const afterReorder = [...beforeReorder];
    const [movedItem] = afterReorder.splice(fromIndex, 1);
    afterReorder.splice(toIndex, 0, movedItem);

    this.ordering[folderId] = afterReorder;

    this.saveToStorage();
  }

  /**
   * Initialize ordering for all folders based on current bookmark structure
   */
  initializeOrdering(bookmarks: IBookmarkItem[]): void {
    const initializeFolder = (folder: IBookmarkItem) => {
      if (folder.children && folder.children.length > 0) {
        // Only initialize if not already ordered
        if (!this.ordering[folder.id]) {
          this.ordering[folder.id] = folder.children.map((child) => child.id);
        }

        // Recursively initialize child folders
        for (const child of folder.children) {
          if (child.children) {
            initializeFolder(child);
          }
        }
      }
    };

    bookmarks.forEach(initializeFolder);
    this.saveToStorage();
  }

  /**
   * Apply ordering to bookmark items
   */
  applyOrdering(items: IBookmarkItem[]): IBookmarkItem[] {
    const result = items.map((item) => {
      const orderedChildren = this.getOrderedChildren(item);
      const resultItem = {
        ...item,
        children: orderedChildren,
      };

      return resultItem;
    });

    return result;
  }

  /**
   * Get children in the correct order
   */
  private getOrderedChildren(folder: IBookmarkItem): IBookmarkItem[] | undefined {
    if (!folder.children || folder.children.length === 0) {
      return folder.children;
    }

    const ordering = this.getOrder(folder.id);
    if (ordering.length === 0) {
      return folder.children;
    }

    // Create a map for quick lookup
    const childrenMap = new Map(folder.children.map((child) => [child.id, child]));

    // Order by the stored ordering, with any new items at the end
    const orderedChildren: IBookmarkItem[] = [];
    const processedIds = new Set<string>();

    // Add items in the stored order, but only if they still exist in the folder
    for (const id of ordering) {
      if (processedIds.has(id)) continue; // avoid duplicates in ordering list
      const child = childrenMap.get(id);
      if (child) {
        orderedChildren.push(child);
        processedIds.add(id);
      }
    }

    // Add any new items that weren't in the ordering
    for (const child of folder.children) {
      if (!processedIds.has(child.id)) {
        orderedChildren.push(child);
      }
    }

    return orderedChildren;
  }

  /**
   * Load ordering from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.ordering = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load bookmark ordering from localStorage:', error);
      this.ordering = {};
    }
  }

  /**
   * Save ordering to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ordering));
    } catch (error) {
      console.error('Failed to save bookmark ordering to localStorage:', error);
    }
  }
}

export const orderingService = new BookmarkOrderingService();
