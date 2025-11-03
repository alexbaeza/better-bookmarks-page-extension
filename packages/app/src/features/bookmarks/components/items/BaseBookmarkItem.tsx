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

export const useBaseBookmarkItem = (
  item: IBookmarkItem,
  dataTestId: string | undefined,
  onEdit: () => void,
  onDelete: () => void,
  onClick?: () => void,
  onFolderClick?: (item: IBookmarkItem) => void,
  iconSize = 16,
  dragHandleVariant: 'grid' | 'list' = 'grid'
) => {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();

  const handleClick = (): void => {
    if (onClick) {
      onClick();
    } else if (onFolderClick) {
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
