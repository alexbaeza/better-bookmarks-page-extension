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
  cleanupStaleOrdering(folder: IBookmarkItem): void;
  getOrderedChildren(folder: IBookmarkItem): IBookmarkItem[] | undefined;
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
      this.ordering[fromFolderId] = this.ordering[fromFolderId].filter((id) => id !== itemId);
    }

    // Add to destination folder at specific index
    if (!this.ordering[toFolderId]) {
      this.ordering[toFolderId] = [];
    }

    // Dedupe in destination before inserting
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
    if (!this.ordering[folderId] || this.ordering[folderId].length === 0) {
      return;
    }

    const beforeReorder = [...this.ordering[folderId]];

    // Validate indices
    if (fromIndex < 0 || fromIndex >= beforeReorder.length) {
      console.warn(`Invalid fromIndex ${fromIndex} for folder ${folderId} with ${beforeReorder.length} items`);
      return;
    }
    if (toIndex < 0 || toIndex > beforeReorder.length) {
      console.warn(`Invalid toIndex ${toIndex} for folder ${folderId} with ${beforeReorder.length} items`);
      return;
    }

    const afterReorder = [...beforeReorder];
    const movedItemId = afterReorder[fromIndex];
    if (!movedItemId) {
      console.warn(`No item at index ${fromIndex} in folder ${folderId}`);
      return;
    }

    afterReorder.splice(fromIndex, 1);
    afterReorder.splice(toIndex, 0, movedItemId);

    this.ordering[folderId] = afterReorder;

    this.saveToStorage();
  }

  /**
   * Clean up stale ordering entries - remove IDs that don't exist in the folder
   */
  cleanupStaleOrdering(folder: IBookmarkItem): void {
    if (!folder.children || folder.children.length === 0) {
      // Remove ordering for empty folders
      if (this.ordering[folder.id]) {
        delete this.ordering[folder.id];
        this.saveToStorage();
      }
      return;
    }

    const currentOrder = this.ordering[folder.id];
    if (!currentOrder || currentOrder.length === 0) {
      return;
    }

    const validIds = new Set(folder.children.map((child) => child.id));
    const cleanedOrder = currentOrder.filter((id) => validIds.has(id));

    // Only update if we actually removed stale entries
    if (cleanedOrder.length !== currentOrder.length) {
      this.ordering[folder.id] = cleanedOrder;
      this.saveToStorage();
    }
  }

  private initializeNewOrdering(folder: IBookmarkItem, children: IBookmarkItem[]): void {
    this.ordering[folder.id] = children.map((child) => child.id);
  }

  private reconcileExistingOrdering(folder: IBookmarkItem): void {
    const currentOrder = this.ordering[folder.id];
    const currentIds = new Set(currentOrder);

    // Add any new items that aren't in ordering (at the end to maintain existing order)
    const newItems = folder.children?.filter((child) => !currentIds.has(child.id)).map((child) => child.id) ?? [];

    if (newItems.length > 0) {
      // Add new items to the end of ordering
      this.ordering[folder.id] = [...currentOrder, ...newItems];
    }
  }

  private reconcileFolderOrdering(folder: IBookmarkItem): void {
    // Guard clause - this method should only be called with folders that have children
    if (!folder.children || folder.children.length === 0) {
      return;
    }

    // If no ordering exists, initialize with current children
    if (!this.ordering[folder.id]) {
      this.initializeNewOrdering(folder, folder.children);
    } else {
      // Reconcile: ensure all current children are in ordering
      this.reconcileExistingOrdering(folder);
    }

    // Recursively reconcile child folders
    for (const child of folder.children) {
      if (child.children) {
        this.reconcileFolderOrdering(child);
      }
    }
  }

  /**
   * Initialize ordering for all folders based on current bookmark structure
   * Also reconciles ordering with current bookmark state
   */
  initializeOrdering(bookmarks: IBookmarkItem[]): void {
    bookmarks.forEach((folder) => {
      if (folder.children && folder.children.length > 0) {
        this.reconcileFolderOrdering(folder);
      }
    });

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
   * Automatically cleans up stale IDs from ordering when detected
   */
  getOrderedChildren(folder: IBookmarkItem): IBookmarkItem[] | undefined {
    if (!folder.children || folder.children.length === 0) {
      this.cleanupEmptyFolderOrdering(folder.id);
      return folder.children;
    }

    const ordering = this.getOrder(folder.id);
    if (ordering.length === 0) {
      return folder.children;
    }

    const { orderedChildren, cleanedOrder } = this.buildOrderedChildren(folder, ordering);

    // Automatically clean up stale IDs if any were detected
    if (cleanedOrder.length !== ordering.length) {
      this.ordering[folder.id] = cleanedOrder;
      this.saveToStorage();
    }

    return orderedChildren;
  }

  private cleanupEmptyFolderOrdering(folderId: string): void {
    if (!this.ordering[folderId]) return;
    delete this.ordering[folderId];
    this.saveToStorage();
  }

  private buildOrderedChildren(
    folder: IBookmarkItem,
    ordering: string[]
  ): { orderedChildren: IBookmarkItem[]; cleanedOrder: string[] } {
    const children = folder.children ?? [];

    // Create a map for quick lookup
    const childrenMap = new Map(children.map((child) => [child.id, child]));
    const validIds = new Set(children.map((child) => child.id));

    const orderedChildren: IBookmarkItem[] = [];
    const processedIds = new Set<string>();
    const cleanedOrder: string[] = [];

    // Add items in the stored order, but only if they still exist in the folder
    for (const id of ordering) {
      if (processedIds.has(id)) continue; // avoid duplicates in ordering list
      if (!validIds.has(id)) continue;

      const child = childrenMap.get(id);
      if (!child) continue;

      orderedChildren.push(child);
      processedIds.add(child.id);
      cleanedOrder.push(id);
    }

    // Add any new items that weren't in the ordering
    for (const child of children) {
      if (processedIds.has(child.id)) continue;
      orderedChildren.push(child);
      cleanedOrder.push(child.id);
    }

    return { orderedChildren, cleanedOrder };
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
