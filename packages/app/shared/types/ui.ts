import type { ReactNode } from 'react';

import type { IBookmarkItem } from './bookmarks';

export enum BookmarkDisplayMode {
  Grid = 'grid',
  List = 'list',
}

export interface BaseItemProps {
  dataTestId?: string;
  icon: ReactNode;
  title: string;
  url?: string;
  onClick?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  children?: ReactNode;
}

export interface BookmarkItemProps extends BaseItemProps {
  item: IBookmarkItem;
  onFolderClick?: (item: IBookmarkItem) => void;
}

export interface ViewModeProps {
  viewMode: 'grid' | 'list';
}

export interface HoverState {
  hovered: boolean;
  clearHide: () => void;
  scheduleHide: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
