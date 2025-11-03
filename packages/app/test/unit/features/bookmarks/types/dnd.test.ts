import { describe, expect, it } from 'vitest';
import type { DraggableBookmarkItem } from '@/features/bookmarks/types/dnd';

describe('dnd types', () => {
  it('should define DraggableBookmarkItem interface', () => {
    const item: DraggableBookmarkItem = {
      id: '1',
      folderId: 'folder-1',
      index: 0,
      item: {
        id: '1',
        title: 'Test',
        url: 'https://example.com',
      },
    };

    expect(item.id).toBe('1');
    expect(item.folderId).toBe('folder-1');
    expect(item.index).toBe(0);
    expect(item.item).toBeDefined();
  });

  it('should allow optional properties in DraggableBookmarkItem', () => {
    const item: DraggableBookmarkItem = {
      id: '1',
      folderId: 'folder-1',
      index: 0,
      item: {
        id: '1',
        title: 'Test',
      },
    };

    expect(item.item.url).toBeUndefined();
  });
});
