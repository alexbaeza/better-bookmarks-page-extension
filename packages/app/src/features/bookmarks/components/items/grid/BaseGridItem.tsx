import type React from 'react';
import { useState } from 'react';
import { ItemActionsMenu } from '@/features/bookmarks/components/items/options/ItemActionsMenu';
import { useHover } from '@/features/bookmarks/hooks/useHover';
import { BookmarkDragHandle } from '../BookmarkDragHandle';
import { BookmarkGridItemContent } from '../BookmarkGridItemContent';

export interface BaseGridItemProps {
  dataTestId?: string;
  url?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  icon: React.ReactNode;
  onClick?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export const BaseGridItem: React.FC<BaseGridItemProps> = ({ dataTestId = 'grid-item', icon, url, onClick, onEdit, onDelete, dragHandleProps, children }) => {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();
  const [menuOpen, setMenuOpen] = useState(false);

  // Only show hover background when directly hovering the item, not when menu is open
  const showHoverBackground = hovered && !menuOpen;

  return (
    <BookmarkGridItemContent
      actions={<ItemActionsMenu iconSize={12} onDelete={onDelete} onEdit={onEdit} onMenuOpenChange={setMenuOpen} visible={true} />}
      dataTestId={dataTestId}
      dragHandle={<BookmarkDragHandle className="p-2 min-w-[24px] min-h-[24px] text-xs" hovered={hovered} size={12} variant="grid" />}
      dragHandleProps={dragHandleProps}
      href={url}
      icon={icon}
      isHovered={showHoverBackground}
      onClick={onClick}
      onKeyActivate={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </BookmarkGridItemContent>
  );
};
