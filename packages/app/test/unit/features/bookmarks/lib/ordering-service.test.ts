import { beforeEach, describe, expect, it } from 'vitest';

import { orderingService } from '@/features/bookmarks/lib/ordering-service';

import type { IBookmarkItem } from '@/shared/types/bookmarks';

const makeFolder = (id: string, children: string[]): IBookmarkItem => ({
  id,
  title: id,
  children: children.map((cid) => ({ id: cid, title: cid }) as unknown as IBookmarkItem),
});

describe('orderingService', () => {
  beforeEach(() => {
    // Reset internal storage by re-initializing via initializeOrdering
    orderingService.initializeOrdering([]);
  });

  it('initializes and applies ordering', () => {
    const folder = makeFolder('f1', ['a', 'b', 'c']);
    orderingService.initializeOrdering([folder]);

    const applied = orderingService.applyOrdering([folder])[0];
    expect(applied.children?.map((c) => c.id)).toEqual(['a', 'b', 'c']);
  });

  it('reorders within a folder deterministically', () => {
    const folder = makeFolder('f1', ['a', 'b', 'c']);
    orderingService.initializeOrdering([folder]);

    orderingService.reorderItems('f1', 0, 2);
    const applied = orderingService.applyOrdering([folder])[0];
    expect(applied.children?.map((c) => c.id)).toEqual(['b', 'c', 'a']);
  });

  it('moves between folders and respects index', () => {
    const f1 = makeFolder('f1', ['a', 'b']);
    const f2 = makeFolder('f2', ['x', 'y']);
    orderingService.initializeOrdering([f1, f2]);

    orderingService.moveItem('a', 'f1', 'f2', 1);

    // Update folder structures to reflect the move
    const updatedF1 = makeFolder('f1', ['b']); // 'a' has been moved out
    const updatedF2 = makeFolder('f2', ['x', 'a', 'y']); // 'a' has been moved in

    const [appliedF1, appliedF2] = orderingService.applyOrdering([updatedF1, updatedF2]);
    expect(appliedF1.children?.map((c) => c.id)).toEqual(['b']);
    expect(appliedF2.children?.map((c) => c.id)).toEqual(['x', 'a', 'y']);
  });

  it('dedupes when moving an already-present id into destination', () => {
    const f1 = makeFolder('f1', ['a']);
    const f2 = makeFolder('f2', ['a', 'b']);
    orderingService.initializeOrdering([f1, f2]);

    // Simulate bad state then move again; result should not duplicate 'a'
    orderingService.moveItem('a', 'f1', 'f2', 0);
    orderingService.moveItem('a', 'f1', 'f2', 2);
    const [, appliedF2] = orderingService.applyOrdering([f1, f2]);
    expect(appliedF2.children?.filter((c) => c.id === 'a').length).toBe(1);
  });
});
