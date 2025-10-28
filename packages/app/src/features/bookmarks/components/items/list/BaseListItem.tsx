import type React from 'react';
import { ItemActionsMenu } from '@/features/bookmarks/components/items/options/ItemActionsMenu';
import { useHover } from '@/features/bookmarks/hooks/useHover';
import { BookmarkDragHandle } from '../BookmarkDragHandle';
import { BookmarkListItemContent } from '../BookmarkListItemContent';

export interface BaseListItemProps {
  dataTestId?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  folderId?: string;
}

export const BaseListItem: React.FC<BaseListItemProps> = ({ dataTestId, icon, children, href, onClick, onEdit, onDelete, dragHandleProps, folderId }) => {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();

  return (
    <BookmarkListItemContent
      actions={<ItemActionsMenu iconSize={16} onDelete={onDelete} onEdit={onEdit} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} visible={hovered} />}
      dataTestId={dataTestId}
      dragHandle={<BookmarkDragHandle hovered={hovered} size={16} variant="list" />}
      dragHandleProps={dragHandleProps}
      folderId={folderId}
      hovered={hovered}
      href={href}
      icon={icon}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </BookmarkListItemContent>
  );
};
