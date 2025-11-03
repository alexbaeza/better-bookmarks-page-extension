import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { BookmarkItemMenu } from '@/features/bookmarks/components/items/options/BookmarkItemMenu';
import { BookmarkItemMenuItem } from '@/features/bookmarks/components/items/options/BookmarkItemMenuItem';
import { DeleteConfirmationModal } from '@/features/bookmarks/components/items/options/DeleteConfirmationModal';
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

export const ItemActionsMenu: React.FC<ItemActionsMenuProps> = ({
  visible,
  iconSize = 16,
  className = '',
  onEdit,
  onDelete,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOptionsKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen((o) => !o);
    }
  };

  const handleDeleteClick = () => {
    setMenuOpen(false);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    onDelete?.();
  };

  return (
    <>
      <IconButton
        className={`relative z-20 inline-flex items-center justify-center aspect-square rounded-lg bg-bgColor-secondary text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50 p-1 text-xs text-fgColor-secondary hover:text-fgColor-primary hover:bg-fgColor-hover rounded ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
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

      {menuOpen && (
        <BookmarkItemMenu
          anchorRef={buttonRef}
          onClose={() => setMenuOpen(false)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <BookmarkItemMenuItem
            icon={<Edit2 size={14} />}
            onClick={() => {
              setMenuOpen(false);
              onEdit?.();
            }}
          >
            Edit
          </BookmarkItemMenuItem>
          <BookmarkItemMenuItem icon={<Trash2 size={14} />} onClick={handleDeleteClick}>
            Delete
          </BookmarkItemMenuItem>
        </BookmarkItemMenu>
      )}

      <DeleteConfirmationModal
        dataTestId="delete-confirmation-modal"
        isOpen={deleteModalOpen}
        message="This action cannot be undone."
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete item?"
      />
    </>
  );
};
