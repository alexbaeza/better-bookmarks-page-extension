import { storageKey } from '@/app/providers/atoms';
import { orderingService } from '@/features/bookmarks/lib/ordering-service';
import { mockData } from '@/features/bookmarks/store/mock-data';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

/**
 * Mock implementation of Chrome/Firefox bookmarks API
 * Uses the same interface as chrome.bookmarks and browser.bookmarks
 * This allows us to reuse ChromeBookmarkAPI and FirefoxBookmarkAPI with mock data
 */
class MockBookmarksAPI {
  private data: IBookmarkItem[] = [];
  private listeners: Set<(id: string, changeInfo: { title?: string; url?: string }) => void> = new Set();
  private readonly STORAGE_KEY = storageKey('mock-bookmarks-data');

  constructor() {
    this.loadMockData();
  }

  /**
   * Load mock data as the initial state
   */
  private loadMockData(): void {
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
   * Get current raw data (without ordering applied)
   * Ordering is handled at the app level, not within the mock API
   */
  private getData(): IBookmarkItem[] {
    return this.data;
  }

  /**
   * Notify all listeners of data changes
   */
  private notifyListeners(id: string, changeInfo: { title?: string; url?: string }): void {
    for (const listener of this.listeners) {
      listener(id, changeInfo);
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
        const children = items[i].children;
        if (children && children.length > 0) {
          if (removeFromArray(children)) {
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
   * Convert IBookmarkItem to BookmarkTreeNode format (matches Chrome/Firefox)
   */
  private toBookmarkTreeNode(item: IBookmarkItem): chrome.bookmarks.BookmarkTreeNode {
    return {
      children: item.children?.map(this.toBookmarkTreeNode.bind(this)),
      dateAdded: item.dateAdded,
      dateGroupModified: item.dateGroupModified,
      id: item.id,
      parentId: item.parentId,
      title: item.title,
      url: item.url,
      syncing: false, // Mock data doesn't sync
    };
  }

  /**
   * Convert array of IBookmarkItem to BookmarkTreeNode[]
   */
  private toBookmarkTree(items: IBookmarkItem[]): chrome.bookmarks.BookmarkTreeNode[] {
    return items.map(this.toBookmarkTreeNode.bind(this));
  }

  // Chrome/Firefox Bookmarks API methods

  /**
   * Get the entire bookmark tree (matches chrome.bookmarks.getTree / browser.bookmarks.getTree)
   */
  async getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return this.toBookmarkTree(this.getData());
  }

  /**
   * Get subtree starting from a specific bookmark ID (matches chrome.bookmarks.getSubTree / browser.bookmarks.getSubTree)
   */
  async getSubTree(id: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      return [];
    }

    // Return raw data - ordering is handled at app level
    return [this.toBookmarkTreeNode(bookmark)];
  }

  /**
   * Create a bookmark (matches chrome.bookmarks.create / browser.bookmarks.create)
   */
  async create(bookmark: {
    parentId?: string;
    title: string;
    url?: string;
  }): Promise<chrome.bookmarks.BookmarkTreeNode> {
    const newBookmark: IBookmarkItem = {
      children: bookmark.url ? undefined : [],
      dateAdded: Date.now(),
      dateGroupModified: Date.now(),
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      parentId: bookmark.parentId,
      title: bookmark.title,
      url: bookmark.url,
    };

    const parentId = bookmark.parentId || '1'; // Default to root
    this.addToParent(parentId, newBookmark);

    // Update dateGroupModified for parent folder
    const parent = this.findById(parentId);
    if (parent && !parent.url) {
      parent.dateGroupModified = Date.now();
    }

    // Update ordering service
    const currentOrder = orderingService.getOrder(parentId);
    currentOrder.push(newBookmark.id);
    orderingService.setOrder(parentId, currentOrder);

    this.saveToStorage();
    this.notifyListeners(newBookmark.id, {});

    return this.toBookmarkTreeNode(newBookmark);
  }

  /**
   * Get bookmarks by ID(s) (matches chrome.bookmarks.get / browser.bookmarks.get)
   */
  async get(idOrIdList: string | string[]): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const ids = Array.isArray(idOrIdList) ? idOrIdList : [idOrIdList];
    const results: chrome.bookmarks.BookmarkTreeNode[] = [];

    for (const id of ids) {
      const bookmark = this.findById(id);
      if (bookmark) {
        results.push(this.toBookmarkTreeNode(bookmark));
      }
    }

    return results;
  }

  /**
   * Update a bookmark (matches chrome.bookmarks.update / browser.bookmarks.update)
   */
  async update(id: string, changes: { title?: string; url?: string }): Promise<chrome.bookmarks.BookmarkTreeNode> {
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

    // Update dateGroupModified for parent folder
    const parentId = this.findParentId(id);
    if (parentId) {
      const parent = this.findById(parentId);
      if (parent && !parent.url) {
        parent.dateGroupModified = Date.now();
      }
    }

    this.saveToStorage();
    this.notifyListeners(id, changes);

    return this.toBookmarkTreeNode(bookmark);
  }

  /**
   * Remove a bookmark and all its children (matches chrome.bookmarks.removeTree / browser.bookmarks.removeTree)
   */
  async removeTree(id: string): Promise<void> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      return;
    }

    this.removeById(id);

    // Update ordering service
    const parentId = this.findParentId(id);
    if (parentId) {
      const currentOrder = orderingService.getOrder(parentId);
      const filteredOrder = currentOrder.filter((itemId) => itemId !== id);
      orderingService.setOrder(parentId, filteredOrder);
    }

    this.saveToStorage();
    this.notifyListeners(id, {});
  }

  /**
   * Move a bookmark (matches chrome.bookmarks.move / browser.bookmarks.move)
   */
  async move(
    id: string,
    destination: { parentId?: string; index?: number }
  ): Promise<chrome.bookmarks.BookmarkTreeNode> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      throw new Error(`Bookmark with id ${id} not found`);
    }

    const fromParentId = this.findParentId(id);
    const toParentId = destination.parentId || fromParentId || '1';
    const isSameFolder = fromParentId === toParentId;

    // For same-folder moves (reordering), update raw children array
    if (isSameFolder && destination.index !== undefined) {
      const folder = this.findById(toParentId);
      if (!folder || !folder.children) {
        throw new Error(`Folder with id ${toParentId} not found or has no children`);
      }

      // Find the item's current index in the raw children array
      const currentIndex = folder.children.findIndex((child) => child.id === id);
      if (currentIndex === -1) {
        throw new Error(`Item with id ${id} not found in folder ${toParentId}`);
      }

      // Don't do anything if moving to the same position
      if (currentIndex === destination.index) {
        return this.toBookmarkTreeNode(bookmark);
      }

      // Reorder the raw children array
      const [movedItem] = folder.children.splice(currentIndex, 1);
      folder.children.splice(destination.index, 0, movedItem);

      // Update ordering service with the new order (using IDs)
      const newOrderIds = folder.children.map((child) => child.id);
      orderingService.setOrder(toParentId, newOrderIds);

      // Update dateGroupModified
      folder.dateGroupModified = Date.now();
    } else {
      // Cross-folder move or move to end
      // Remove from current parent
      this.removeById(id);

      // Update ordering in source folder
      if (fromParentId) {
        const sourceOrder = orderingService.getOrder(fromParentId);
        const filteredOrder = sourceOrder.filter((itemId) => itemId !== id);
        orderingService.setOrder(fromParentId, filteredOrder);
      }

      // Add to new parent at specified index
      this.addToParent(toParentId, bookmark, destination.index);

      // Update ordering service
      orderingService.moveItem(id, fromParentId || 'root', toParentId, destination.index ?? 0);
    }

    // Update dateGroupModified for destination folder
    const destinationFolder = this.findById(toParentId);
    if (destinationFolder && !destinationFolder.url) {
      destinationFolder.dateGroupModified = Date.now();
    }

    this.saveToStorage();
    this.notifyListeners(id, {});

    return this.toBookmarkTreeNode(bookmark);
  }

  /**
   * Search bookmarks (matches chrome.bookmarks.search / browser.bookmarks.search)
   */
  async search(query: { query: string }): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    const results: IBookmarkItem[] = [];
    const searchTerm = query.query.toLowerCase();

    const searchInArray = (items: IBookmarkItem[]) => {
      for (const item of items) {
        if (item.title.toLowerCase().includes(searchTerm) || item.url?.toLowerCase().includes(searchTerm)) {
          results.push(item);
        }
        if (item.children) {
          searchInArray(item.children);
        }
      }
    };

    searchInArray(this.getData());
    return results.map(this.toBookmarkTreeNode.bind(this));
  }

  /**
   * Subscribe to bookmark changes (matches chrome.bookmarks.onCreated / browser.bookmarks.onCreated)
   */
  onCreated = {
    addListener: (_callback: (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => void) => {
      // For mock, we'll call this manually after creates
      // In real implementation, this would be handled by browser events
    },
  };

  /**
   * Subscribe to bookmark removals (matches chrome.bookmarks.onRemoved / browser.bookmarks.onRemoved)
   */
  onRemoved = {
    addListener: (_callback: (id: string, removeInfo: { parentId: string; index: number }) => void) => {
      // For mock, we'll call this manually after removes
    },
  };

  /**
   * Subscribe to bookmark updates (matches chrome.bookmarks.onChanged / browser.bookmarks.onChanged)
   */
  onChanged = {
    addListener: (callback: (id: string, changeInfo: { title?: string; url?: string }) => void) => {
      this.listeners.add(callback);
    },
    removeListener: (callback: (id: string, changeInfo: { title?: string; url?: string }) => void) => {
      this.listeners.delete(callback);
    },
  };

  /**
   * Subscribe to bookmark moves (matches chrome.bookmarks.onMoved / browser.bookmarks.onMoved)
   */
  onMoved = {
    addListener: (_callback: (id: string, moveInfo: { parentId: string; index: number }) => void) => {
      // For mock, we'll call this manually after moves
    },
  };
}

// Create singleton instance
export const mockBookmarksAPI = new MockBookmarksAPI();
