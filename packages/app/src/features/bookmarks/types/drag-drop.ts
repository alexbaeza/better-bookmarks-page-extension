export type DragItemType = 'folder' | 'bookmark';

export interface DragOperation {
  fromId: string;
  toId: string;
  fromParentId: string | null;
  toParentId: string | null;
  type: DragItemType;
}

export const DRAG_CONSTANTS = {
  ROOT_FOLDER: 'droppable-root-folder-',
  SIDEBAR_FOLDER: 'droppable-sidebar-folder-',
  FLYOUT_FOLDER: 'droppable-fly-out-sidebar-folder-',
} as const;
