import { storageKey } from '@/app/providers/atoms';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { mockData } from '../../../store/mock-data';
import { orderingService } from '../../ordering-service';

/**
 * Mock data service that simulates real browser behavior
 * - Loads mock data as the source of truth
 * - Triggers re-renders when data changes
 * - Integrates with browser API operations
 */
class MockDataService {
  private data: IBookmarkItem[] = [];
  private listeners: Set<() => void> = new Set();
  private readonly STORAGE_KEY = storageKey('mock-bookmarks-data');

  constructor() {
    this.loadMockData();
  }

  /**
   * Load mock data as the initial state
   */
  private loadMockData(): void {
    // Load from persistent storage if available, otherwise deep clone the seed
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.data = JSON.parse(JSON.stringify(mockData));
      }
    } catch {
      this.data = JSON.parse(JSON.stringify(mockData));
    }
  }

  /**
   * Get current data with ordering applied
   */
  getData(): IBookmarkItem[] {
    // Apply ordering to the raw data
    return orderingService.applyOrdering(this.data);
  }

  /**
   * Subscribe to data changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of data changes
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Persist current mock data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to persist mock data:', e);
    }
  }

  /**
   * Create a new bookmark (simulates browser API)
   */
  async createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<IBookmarkItem> {
    const newBookmark: IBookmarkItem = {
      children: details.url ? undefined : [],
      dateAdded: Date.now(),
      dateGroupModified: Date.now(),
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      parentId: parentId || undefined,
      title: details.title,
      url: details.url,
    };

    if (parentId) {
      this.addToParent(parentId, newBookmark);
    } else {
      this.data.push(newBookmark);
    }
    this.saveToStorage();
    this.notifyListeners();
    return newBookmark;
  }

  /**
   * Update a bookmark (simulates browser API)
   */
  async updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<IBookmarkItem> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      throw new Error(`Bookmark with id ${id} not found`);
    }

    if (changes.title !== undefined) {
      bookmark.title = changes.title;
    }
    if (changes.url !== undefined) {
      bookmark.url = changes.url;
    }
    this.saveToStorage();
    this.notifyListeners();
    return bookmark;
  }

  /**
   * Remove a bookmark (simulates browser API)
   */
  async removeBookmark(id: string): Promise<void> {
    this.removeById(id);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Move a bookmark (simulates browser API)
   */
  async moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      throw new Error(`Bookmark with id ${id} not found`);
    }

    const fromParentId = this.findParentId(id);

    // Remove from current parent (no-op if already removed)
    this.removeById(id);

    // Add to new parent
    this.addToParent(destinationParentId, bookmark, index);

    // Update ordering service with dedupe and clamped index
    orderingService.moveItem(id, fromParentId || 'root', destinationParentId, index ?? 0);

    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Find bookmark by ID
   */
  private findById(id: string): IBookmarkItem | null {
    const findInArray = (items: IBookmarkItem[]): IBookmarkItem | null => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }
        if (item.children) {
          const found = findInArray(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInArray(this.data);
  }

  /**
   * Find parent ID of a bookmark
   */
  private findParentId(id: string): string | null {
    const findParentInArray = (items: IBookmarkItem[], parentId: string | null = null): string | null => {
      for (const item of items) {
        if (item.id === id) {
          return parentId;
        }
        if (item.children) {
          const found = findParentInArray(item.children, item.id);
          if (found) return found;
        }
      }
      return null;
    };

    return findParentInArray(this.data);
  }

  /**
   * Remove bookmark by ID
   */
  private removeById(id: string): void {
    const removeFromArray = (items: IBookmarkItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items.splice(i, 1);
          return true;
        }
        if (items[i].children) {
          if (removeFromArray(items[i].children)) {
            return true;
          }
        }
      }
      return false;
    };

    removeFromArray(this.data);
  }

  /**
   * Add bookmark to parent
   */
  private addToParent(parentId: string, bookmark: IBookmarkItem, index?: number): void {
    const parent = this.findById(parentId);
    if (!parent) {
      throw new Error(`Parent with id ${parentId} not found`);
    }

    if (!parent.children) {
      parent.children = [];
    }

    if (index !== undefined) {
      parent.children.splice(index, 0, bookmark);
    } else {
      parent.children.push(bookmark);
    }

    bookmark.parentId = parentId;
  }

  /**
   * Search bookmarks
   */
  async searchBookmarks(query: string): Promise<IBookmarkItem[]> {
    const results: IBookmarkItem[] = [];
    const searchInArray = (items: IBookmarkItem[]) => {
      for (const item of items) {
        if (item.title.toLowerCase().includes(query.toLowerCase()) || item.url?.toLowerCase().includes(query.toLowerCase())) {
          results.push(item);
        }
        if (item.children) {
          searchInArray(item.children);
        }
      }
    };

    searchInArray(this.data);
    return results;
  }

  /**
   * Get bookmark by ID
   */
  async getBookmark(id: string): Promise<IBookmarkItem | null> {
    return this.findById(id);
  }

  /**
   * Reorder items within a folder
   */
  async reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void> {
    // Find the folder
    const folder = this.findById(folderId);
    if (!folder || !folder.children) {
      throw new Error(`Folder with id ${folderId} not found or has no children`);
    }

    // Reorder in mock data
    const children = folder.children;
    const [movedItem] = children.splice(fromIndex, 1);
    children.splice(toIndex, 0, movedItem);

    // Persist the full new order to avoid index/order mismatches
    const newOrder = children.map((c) => c.id);
    orderingService.setOrder(folderId, newOrder);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Reset to initial mock data
   */
  reset(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
    this.loadMockData();
    this.notifyListeners();
  }
}

export const mockDataService = new MockDataService();
