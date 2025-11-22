import type React from 'react';
import { BookmarkDragHandle } from '@/features/bookmarks/components/items/BookmarkDragHandle';
import { ItemActionsMenu } from '@/features/bookmarks/components/items/options/ItemActionsMenu';
import { useHover } from '@/features/bookmarks/hooks/useHover';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BaseBookmarkItemRenderProps {
  item: IBookmarkItem;
  dataTestId: string;
  actions: React.ReactNode;
  dragHandle: React.ReactNode;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export interface BaseBookmarkItemOptions {
  item: IBookmarkItem;
  dataTestId?: string;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
  onFolderClick?: (item: IBookmarkItem) => void;
  iconSize?: number;
  dragHandleVariant?: 'grid' | 'list';
}

export const useBaseBookmarkItem = ({
  item,
  dataTestId,
  onEdit,
  onDelete,
  onClick,
  onFolderClick,
  iconSize = 16,
  dragHandleVariant = 'grid',
}: BaseBookmarkItemOptions) => {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();

  const handleClick = (): void => {
    if (onClick) {
      onClick();
    } else if (onFolderClick && item.children) {
      onFolderClick(item);
    }
  };

  const actions = <ItemActionsMenu iconSize={iconSize} onDelete={onDelete} onEdit={onEdit} visible={hovered} />;

  const dragHandle = (
    <BookmarkDragHandle
      className={dragHandleVariant === 'grid' ? 'p-2 min-w-[24px] min-h-[24px] text-xs' : ''}
      hovered={hovered}
      size={iconSize}
      variant={dragHandleVariant}
    />
  );

  const testId = dataTestId || (item.children ? `bookmark-folder-item-${item.id}` : `bookmark-item-${item.id}`);

  return {
    dataTestId: testId,
    actions,
    dragHandle,
    hovered,
    onMouseEnter,
    onMouseLeave,
    onClick: handleClick,
  };
};
