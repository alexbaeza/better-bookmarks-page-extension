/**
 * Drag and drop constants
 */

export const DND_ITEM_TYPES = {
  BOOKMARK: 'bookmark',
} as const;

export type DndItemType = (typeof DND_ITEM_TYPES)[keyof typeof DND_ITEM_TYPES];
