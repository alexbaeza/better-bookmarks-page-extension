import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { BookmarkItemMenu } from '@/features/bookmarks/components/items/options/BookmarkItemMenu';
import { BookmarkItemMenuItem } from '@/features/bookmarks/components/items/options/BookmarkItemMenuItem';
import { IconButton } from '@/shared/ui/IconButton';

export interface ItemActionsMenuProps {
  visible: boolean;
  iconSize?: number;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ItemActionsMenu: React.FC<ItemActionsMenuProps> = ({ visible, iconSize = 16, className = '', onEdit, onDelete, onMouseEnter, onMouseLeave }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOptionsKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen((o) => !o);
    }
  };

  return (
    <>
      {visible && (
        <IconButton
          className={`text-fgColor-secondary hover:text-fgColor-primary hover:bg-fgColor-hover rounded ${className}`}
          dataTestId="item-options-button"
          icon={<MoreVertical size={iconSize} />}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          onKeyDown={handleOptionsKeyDown}
          ref={buttonRef as React.Ref<HTMLButtonElement>}
          size="sm"
        />
      )}

      {menuOpen && (
        <BookmarkItemMenu anchorRef={buttonRef} onClose={() => setMenuOpen(false)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <BookmarkItemMenuItem
            icon={<Edit2 size={14} />}
            onClick={() => {
              setMenuOpen(false);
              onEdit?.();
            }}
          >
            Edit
          </BookmarkItemMenuItem>
          <BookmarkItemMenuItem
            confirmLabel="Confirm delete?"
            icon={<Trash2 size={14} />}
            onConfirm={() => {
              setMenuOpen(false);
              onDelete?.();
            }}
          >
            Delete
          </BookmarkItemMenuItem>
        </BookmarkItemMenu>
      )}
    </>
  );
};
