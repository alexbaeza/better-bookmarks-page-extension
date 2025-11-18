import { storageKey } from '@/app/providers/atoms';
import { orderingService } from '@/features/bookmarks/lib/ordering-service';
import { chromeMockData } from '@/features/bookmarks/store/chrome-mock-data';
import { firefoxMockData } from '@/features/bookmarks/store/firefox-mock-data';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

// Firefox built-in folder IDs
const FIREFOX_BUILT_IN_IDS = {
  ROOT: 'root________',
  MENU: 'menu________',
  TOOLBAR: 'toolbar_____',
  UNFILED: 'unfiled_____',
  MOBILE: 'mobile______',
} as const;

// Chrome built-in folder types
const CHROME_BUILT_IN_TYPES = {
  BOOKMARKS_BAR: 'bookmarks-bar',
  OTHER: 'other',
} as const;

// Map Firefox IDs to Chrome folderType
const FIREFOX_TO_CHROME_MAP: Record<string, string> = {
  [FIREFOX_BUILT_IN_IDS.TOOLBAR]: CHROME_BUILT_IN_TYPES.BOOKMARKS_BAR,
  [FIREFOX_BUILT_IN_IDS.UNFILED]: CHROME_BUILT_IN_TYPES.OTHER,
};

// Map Chrome IDs to Chrome folderType (for Chrome mock data)
const CHROME_ID_TO_FOLDER_TYPE_MAP: Record<string, string> = {
  '1': CHROME_BUILT_IN_TYPES.BOOKMARKS_BAR, // Bookmarks Bar
  '2': CHROME_BUILT_IN_TYPES.OTHER, // Other Bookmarks
};

/**
 * Mock implementation of Chrome/Firefox bookmarks API
 * Uses the same interface as chrome.bookmarks and browser.bookmarks
 * This allows us to reuse ChromeBookmarkAPI and FirefoxBookmarkAPI with mock data
 * Note: This implements the browser API interface, not BrowserBookmarkAPI
 * Loads browser-specific mock data based on the browser type passed to the constructor
 */
//TODO: Should find a way to get rid of this as it causes inconsistent behaviour between real apis and it's difficult to mantain and keep up to date
class MockBookmarksAPI {
  private data: IBookmarkItem[] = [];
  private listeners: Set<(id: string, changeInfo: { title?: string; url?: string }) => void> = new Set();
  private readonly STORAGE_KEY = storageKey('mock-bookmarks-data');
  private readonly browserType: 'chrome' | 'firefox';

  constructor(browserType: 'chrome' | 'firefox') {
    this.browserType = browserType;
    this.loadMockData();
  }

  /**
   * Load mock data as the initial state
   * Loads the appropriate mock data file based on browser type,
   * converting raw browser bookmark nodes into IBookmarkItem[]
   */
  private loadMockData(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored) as IBookmarkItem[];
      } else {
        // Initialize from browser-specific mock data
        this.initFromMockData();
      }
    } catch {
      // Fallback to browser-specific mock data
      this.initFromMockData();
    }
  }

  /**
   * Initialize internal data from raw browser-specific mock bookmark trees
   * Converts Chrome/Firefox BookmarkTreeNode structures into IBookmarkItem[]
   */
  private initFromMockData(): void {
    if (this.browserType === 'firefox') {
      this.data = firefoxMockData.map((node) => this.fromFirefoxNode(node));
    } else {
      this.data = chromeMockData.map((node) => this.fromChromeNode(node));
    }
  }

  /**
   * Convert a raw Chrome BookmarkTreeNode (and its subtree) into an IBookmarkItem tree
   */
  private fromChromeNode(node: chrome.bookmarks.BookmarkTreeNode): IBookmarkItem {
    const item: IBookmarkItem = {
      id: node.id,
      parentId: node.parentId,
      title: node.title ?? '',
      url: node.url,
      dateAdded: node.dateAdded ?? Date.now(),
    };

    if (node.children && node.children.length > 0) {
      item.children = node.children.map((child) => this.fromChromeNode(child));
    } else if (!node.url) {
      // Folder with no children yet
      item.children = [];
    }

    return item;
  }

  /**
   * Convert a raw Firefox BookmarkTreeNode (and its subtree) into an IBookmarkItem tree
   */
  private fromFirefoxNode(node: browser.bookmarks.BookmarkTreeNode): IBookmarkItem {
    const item: IBookmarkItem = {
      id: node.id,
      parentId: node.parentId,
      title: node.title ?? '',
      url: node.url,
      dateAdded: node.dateAdded ?? Date.now(),
    };

    if (node.children && node.children.length > 0) {
      item.children = node.children.map((child) => this.fromFirefoxNode(child));
    } else if (!node.url) {
      // Folder with no children yet
      item.children = [];
    }

    return item;
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
   * Convert IBookmarkItem to Chrome BookmarkTreeNode format
   */
  private toChromeBookmarkTreeNode(item: IBookmarkItem): chrome.bookmarks.BookmarkTreeNode {
    // Use Chrome ID mapping for Chrome data, or Firefox mapping if converting Firefox data
    const folderType = (CHROME_ID_TO_FOLDER_TYPE_MAP[item.id] ||
      FIREFOX_TO_CHROME_MAP[item.id]) as chrome.bookmarks.BookmarkTreeNode['folderType'];
    return {
      children: item.children?.map(this.toChromeBookmarkTreeNode.bind(this)),
      dateAdded: item.dateAdded,
      dateGroupModified: item.dateGroupModified,
      folderType,
      id: item.id,
      parentId: item.parentId,
      title: item.title,
      url: item.url,
      syncing: false, // Mock data doesn't sync
    };
  }

  /**
   * Convert IBookmarkItem to Firefox BookmarkTreeNode format
   */
  private toFirefoxBookmarkTreeNode(item: IBookmarkItem): browser.bookmarks.BookmarkTreeNode {
    return {
      children: item.children?.map(this.toFirefoxBookmarkTreeNode.bind(this)),
      dateAdded: item.dateAdded,
      dateGroupModified: item.dateGroupModified,
      id: item.id,
      parentId: item.parentId,
      title: item.title,
      url: item.url,
    };
  }

  /**
   * Convert IBookmarkItem to BookmarkTreeNode format (matches Chrome/Firefox based on browserType)
   */
  private toBookmarkTreeNode(
    item: IBookmarkItem
  ): chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode {
    if (this.browserType === 'chrome') {
      return this.toChromeBookmarkTreeNode(item);
    }
    return this.toFirefoxBookmarkTreeNode(item);
  }

  /**
   * Convert array of IBookmarkItem to BookmarkTreeNode[]
   */
  private toBookmarkTree(
    items: IBookmarkItem[]
  ): chrome.bookmarks.BookmarkTreeNode[] | browser.bookmarks.BookmarkTreeNode[] {
    return items.map(this.toBookmarkTreeNode.bind(this)) as
      | chrome.bookmarks.BookmarkTreeNode[]
      | browser.bookmarks.BookmarkTreeNode[];
  }

  // Chrome/Firefox Bookmarks API methods

  /**
   * Get the entire bookmark tree (matches chrome.bookmarks.getTree / browser.bookmarks.getTree)
   */
  async getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[] | browser.bookmarks.BookmarkTreeNode[]> {
    return this.toBookmarkTree(this.getData());
  }

  /**
   * Get subtree starting from a specific bookmark ID (matches chrome.bookmarks.getSubTree / browser.bookmarks.getSubTree)
   */
  async getSubTree(id: string): Promise<chrome.bookmarks.BookmarkTreeNode[] | browser.bookmarks.BookmarkTreeNode[]> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      return [];
    }

    // Return raw data - ordering is handled at app level
    return [this.toBookmarkTreeNode(bookmark)] as
      | chrome.bookmarks.BookmarkTreeNode[]
      | browser.bookmarks.BookmarkTreeNode[];
  }

  /**
   * Create a bookmark (matches chrome.bookmarks.create / browser.bookmarks.create)
   */
  async create(bookmark: {
    parentId?: string;
    title: string;
    url?: string;
  }): Promise<chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode> {
    const newBookmark: IBookmarkItem = {
      children: bookmark.url ? undefined : [],
      dateAdded: Date.now(),
      dateGroupModified: Date.now(),
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      parentId: bookmark.parentId,
      title: bookmark.title,
      url: bookmark.url,
    };

    // Use appropriate root ID based on browser type
    const defaultRootId = this.browserType === 'firefox' ? FIREFOX_BUILT_IN_IDS.ROOT : '0';
    const parentId = bookmark.parentId || defaultRootId;
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

    return this.toBookmarkTreeNode(newBookmark) as
      | chrome.bookmarks.BookmarkTreeNode
      | browser.bookmarks.BookmarkTreeNode;
  }

  /**
   * Get bookmarks by ID(s) (matches chrome.bookmarks.get / browser.bookmarks.get)
   */
  async get(
    idOrIdList: string | string[]
  ): Promise<chrome.bookmarks.BookmarkTreeNode[] | browser.bookmarks.BookmarkTreeNode[]> {
    const ids = Array.isArray(idOrIdList) ? idOrIdList : [idOrIdList];
    const results: (chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode)[] = [];

    for (const id of ids) {
      const bookmark = this.findById(id);
      if (bookmark) {
        results.push(this.toBookmarkTreeNode(bookmark));
      }
    }

    return results as chrome.bookmarks.BookmarkTreeNode[] | browser.bookmarks.BookmarkTreeNode[];
  }

  /**
   * Update a bookmark (matches chrome.bookmarks.update / browser.bookmarks.update)
   */
  async update(
    id: string,
    changes: { title?: string; url?: string }
  ): Promise<chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode> {
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

    return this.toBookmarkTreeNode(bookmark) as chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode;
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

  private getDestinationParentId(bookmarkId: string, destination: { parentId?: string; index?: number }): string {
    const defaultRootId = this.browserType === 'firefox' ? FIREFOX_BUILT_IN_IDS.ROOT : '0';
    const fromParentId = this.findParentId(bookmarkId);
    return destination.parentId || fromParentId || defaultRootId;
  }

  private handleSameFolderMove(
    bookmark: IBookmarkItem,
    folderId: string,
    destinationIndex: number
  ): chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode {
    const folder = this.findById(folderId);
    if (!folder?.children) {
      throw new Error(`Folder with id ${folderId} not found or has no children`);
    }

    // Find the item's current index in the raw children array
    const currentIndex = folder.children.findIndex((child) => child.id === bookmark.id);
    if (currentIndex === -1) {
      throw new Error(`Item with id ${bookmark.id} not found in folder ${folderId}`);
    }

    // Don't do anything if moving to the same position
    if (currentIndex === destinationIndex) {
      return this.toBookmarkTreeNode(bookmark) as
        | chrome.bookmarks.BookmarkTreeNode
        | browser.bookmarks.BookmarkTreeNode;
    }

    // Simulate real Chrome/Firefox API behavior:
    // The index parameter is interpreted relative to the array BEFORE the item is removed.
    // This means:
    // - Remove item at currentIndex
    // - Insert at destinationIndex
    // - The insertion index naturally ends up one less than specified when moving down
    //   because the removal shifted items left
    //
    // Example: [A, B, C, D] move B (index 1) to index 3
    // - Remove B: [A, C, D]
    // - Insert at 3: [A, C, D, B] ✓ (B is now at index 3)
    //
    // Example: [A, B, C, D] move C (index 2) to index 0
    // - Remove C: [A, B, D]
    // - Insert at 0: [C, A, B, D] ✓ (C is now at index 0)
    const [movedItem] = folder.children.splice(currentIndex, 1);
    folder.children.splice(destinationIndex, 0, movedItem);

    // Update ordering service with the new order (using IDs)
    const newOrderIds = folder.children.map((child) => child.id);
    orderingService.setOrder(folderId, newOrderIds);

    // Update dateGroupModified
    folder.dateGroupModified = Date.now();

    return this.toBookmarkTreeNode(bookmark) as chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode;
  }

  private handleCrossFolderMove(
    bookmark: IBookmarkItem,
    fromParentId: string | undefined,
    toParentId: string,
    destinationIndex?: number
  ): void {
    // Remove from current parent
    this.removeById(bookmark.id);

    // Update ordering in source folder
    if (fromParentId) {
      const sourceOrder = orderingService.getOrder(fromParentId);
      const filteredOrder = sourceOrder.filter((itemId) => itemId !== bookmark.id);
      orderingService.setOrder(fromParentId, filteredOrder);
    }

    // Add to new parent at specified index (or end if undefined)
    this.addToParent(toParentId, bookmark, destinationIndex);

    // Get the actual index where the bookmark was added
    const parent = this.findById(toParentId);
    const actualIndex = parent?.children?.findIndex((child) => child.id === bookmark.id) ?? 0;

    // Update ordering service with the actual index
    orderingService.moveItem(bookmark.id, fromParentId || 'root', toParentId, actualIndex);

    // IMPORTANT: Ensure destination folder ordering includes all children
    // After moveItem, the ordering service should have the moved item,
    // but we need to ensure ALL other children are also in the ordering
    if (parent?.children) {
      const currentOrder = orderingService.getOrder(toParentId);
      const actualChildIds = parent.children.map((child) => child.id);

      // Find children that exist in raw data but not in ordering
      const missingIds = actualChildIds.filter((id) => !currentOrder.includes(id));

      if (missingIds.length > 0) {
        // Add missing IDs to ordering while preserving existing order
        // Append missing IDs at the end
        const updatedOrder = [...currentOrder, ...missingIds];
        orderingService.setOrder(toParentId, updatedOrder);
      }
    }
  }

  private updateDestinationFolderTimestamp(parentId: string): void {
    const destinationFolder = this.findById(parentId);
    if (destinationFolder && !destinationFolder.url) {
      destinationFolder.dateGroupModified = Date.now();
    }
  }

  /**
   * Move a bookmark (matches chrome.bookmarks.move / browser.bookmarks.move)
   */
  async move(
    id: string,
    destination: { parentId?: string; index?: number }
  ): Promise<chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode> {
    const bookmark = this.findById(id);
    if (!bookmark) {
      throw new Error(`Bookmark with id ${id} not found`);
    }

    const fromParentId = this.findParentId(id);
    const toParentId = this.getDestinationParentId(id, destination);
    const isSameFolder = fromParentId === toParentId;

    let result: chrome.bookmarks.BookmarkTreeNode | browser.bookmarks.BookmarkTreeNode;

    // For same-folder moves (reordering), update raw children array
    if (isSameFolder && destination.index !== undefined) {
      result = this.handleSameFolderMove(bookmark, toParentId, destination.index);
    } else {
      // Cross-folder move or move to end
      this.handleCrossFolderMove(bookmark, fromParentId ?? undefined, toParentId, destination.index);
      result = this.toBookmarkTreeNode(bookmark) as
        | chrome.bookmarks.BookmarkTreeNode
        | browser.bookmarks.BookmarkTreeNode;

      // Update dateGroupModified for source folder (item was removed)
      if (fromParentId) {
        this.updateDestinationFolderTimestamp(fromParentId);
      }
    }

    // Update dateGroupModified for destination folder
    this.updateDestinationFolderTimestamp(toParentId);

    this.saveToStorage();
    this.notifyListeners(id, {});

    return result;
  }

  /**
   * Search bookmarks (matches chrome.bookmarks.search / browser.bookmarks.search)
   */
  async search(query: {
    query: string;
  }): Promise<chrome.bookmarks.BookmarkTreeNode[] | browser.bookmarks.BookmarkTreeNode[]> {
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
    return results.map(this.toBookmarkTreeNode.bind(this)) as
      | chrome.bookmarks.BookmarkTreeNode[]
      | browser.bookmarks.BookmarkTreeNode[];
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

export { MockBookmarksAPI };
