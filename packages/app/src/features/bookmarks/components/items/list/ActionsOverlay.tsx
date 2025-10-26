import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';

import { IconButton } from '@/shared/ui/IconButton';
import { Menu } from '../options/Menu';
import { MenuItem } from '../options/MenuItem';

export interface ActionsOverlayProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  visible: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ActionsOverlay: React.FC<ActionsOverlayProps> = ({ onMouseEnter, onMouseLeave, visible, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!visible) return null;

  return (
    <div
      aria-label="Item actions"
      className="
        absolute inset-y-0 right-0 z-20
        flex h-full items-center space-x-1
        rounded-r-lg p-1
      "
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="toolbar"
    >
      <IconButton
        className="text-fgColor-secondary hover:text-fgColor-primary min-w-[32px] min-h-[32px] p-2"
        dataTestId="item-options-button"
        icon={<MoreVertical size={16} />}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((o) => !o);
        }}
        ref={buttonRef as React.Ref<HTMLButtonElement>}
      />

      {menuOpen && (
        <Menu anchorRef={buttonRef} onClose={() => setMenuOpen(false)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <MenuItem
            icon={<Edit2 size={14} />}
            onClick={() => {
              setMenuOpen(false);
              onEdit?.();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            confirmLabel="Confirm delete?"
            icon={<Trash2 size={14} />}
            onConfirm={() => {
              setMenuOpen(false);
              onDelete?.();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};
