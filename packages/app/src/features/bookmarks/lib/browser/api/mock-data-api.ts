import { mockData } from '../../../store/mock-data';
import type { BrowserBookmarkAPI, NormalizedBookmarkItem, NormalizedBookmarkTree } from '../types';

/**
 * Simple mock implementation for development
 * Uses static mock data and Google favicon service
 */
export class MockDataBookmarkAPI implements BrowserBookmarkAPI {
  private mockData: NormalizedBookmarkItem[];

  constructor() {
    // Convert mock data to normalized format
    this.mockData = this.convertToNormalized(mockData);
  }

  async getBookmarksTree(): Promise<NormalizedBookmarkTree> {
    return {
      folders: this.mockData.filter((item) => item.children && item.title !== 'Uncategorized'),
      uncategorized: this.mockData.find((item) => item.title === 'Uncategorized'),
    };
  }

  async createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<NormalizedBookmarkItem> {
    // Create bookmark in mock data
    const newItem: NormalizedBookmarkItem = {
      id: Date.now().toString(),
      parentId: parentId || 'Uncategorized',
      title: details.title,
      ...(details.url ? { url: details.url } : { children: [] }),
      dateAdded: Date.now(),
    };

    // Add to mock data
    this.addToMockDataAtIndex(newItem);

    return newItem;
  }

  async removeBookmark(id: string): Promise<void> {
    this.removeFromMockData(id);
  }

  async updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<NormalizedBookmarkItem> {
    const updated = this.updateInMockData(id, changes);
    if (!updated) {
      throw new Error(`Bookmark with id ${id} not found`);
    }

    return updated;
  }

  async moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void> {
    this.moveInMockData(id, destinationParentId, index);
  }

  async getBookmark(id: string): Promise<NormalizedBookmarkItem | null> {
    return this.findInMockData(id);
  }

  async searchBookmarks(query: string): Promise<NormalizedBookmarkItem[]> {
    return this.searchInMockData(query);
  }

  async reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void> {
    // Simple in-memory reorder for mock
    const folder = this.findInMockData(folderId);
    if (!folder || !folder.children) return;
    const children = folder.children;
    const [moved] = children.splice(fromIndex, 1);
    children.splice(toIndex, 0, moved);
  }

  /**
   * Convert IBookmarkItem[] to NormalizedBookmarkItem[]
   */
  private convertToNormalized(items: unknown[]): NormalizedBookmarkItem[] {
    return items.map((item) => ({
      children: item.children ? this.convertToNormalized(item.children) : undefined,
      dateAdded: item.dateAdded,
      dateGroupModified: item.dateGroupModified,
      id: item.id,
      parentId: item.parentId,
      title: item.title,
      url: item.url,
    }));
  }

  /**
   * Add item to mock data at specific index
   */
  private addToMockDataAtIndex(item: NormalizedBookmarkItem, index?: number): void {
    const insert = (list: NormalizedBookmarkItem[]) => {
      for (const node of list) {
        if (node.id === item.parentId && node.children) {
          if (index !== undefined && index >= 0 && index <= node.children.length) {
            node.children.splice(index, 0, item);
          } else {
            node.children.push(item);
          }
          return true;
        }
        if (node.children && insert(node.children)) return true;
      }
      return false;
    };
    insert(this.mockData);
  }

  /**
   * Remove item from mock data
   */
  private removeFromMockData(id: string): void {
    const removeRec = (list: NormalizedBookmarkItem[]): NormalizedBookmarkItem[] =>
      list
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? removeRec(node.children) : undefined,
        }));
    this.mockData = removeRec(this.mockData);
  }

  /**
   * Update item in mock data
   */
  private updateInMockData(id: string, changes: { title?: string; url?: string }): NormalizedBookmarkItem | null {
    const updateRec = (list: NormalizedBookmarkItem[]): NormalizedBookmarkItem[] =>
      list.map((node) => {
        if (node.id === id) {
          return { ...node, ...changes };
        }
        if (node.children) {
          return { ...node, children: updateRec(node.children) };
        }
        return node;
      });

    this.mockData = updateRec(this.mockData);
    return this.findInMockData(id);
  }

  /**
   * Move item in mock data with optional index
   */
  private moveInMockData(id: string, destinationParentId: string, index?: number): void {
    const item = this.findInMockData(id);
    if (!item) return;

    // Remove from current location
    this.removeFromMockData(id);

    // Create a new item with updated parentId to avoid mutation
    const movedItem: NormalizedBookmarkItem = {
      ...item,
      parentId: destinationParentId,
    };

    // Add to new location with proper index
    this.addToMockDataAtIndex(movedItem, index);
  }

  /**
   * Find item in mock data
   */
  private findInMockData(id: string): NormalizedBookmarkItem | null {
    const findRec = (list: NormalizedBookmarkItem[]): NormalizedBookmarkItem | null => {
      for (const node of list) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findRec(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findRec(this.mockData);
  }

  /**
   * Search in mock data
   */
  private searchInMockData(query: string): NormalizedBookmarkItem[] {
    const results: NormalizedBookmarkItem[] = [];
    const searchRec = (list: NormalizedBookmarkItem[]) => {
      for (const node of list) {
        if (node.title.toLowerCase().includes(query.toLowerCase()) || node.url?.toLowerCase().includes(query.toLowerCase())) {
          results.push(node);
        }
        if (node.children) {
          searchRec(node.children);
        }
      }
    };
    searchRec(this.mockData);
    return results;
  }
}
