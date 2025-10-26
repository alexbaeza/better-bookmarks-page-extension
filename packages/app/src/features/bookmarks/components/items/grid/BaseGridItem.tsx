import { Edit2, GripVertical, MoreVertical, Trash2 } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Menu } from '../options/Menu';
import { MenuItem } from '../options/MenuItem';

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
  const [hovered, setHovered] = useState(false);
  const hideTimeout = useRef<number | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  const clearHide = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = undefined;
    }
  }, []);

  const scheduleHide = () => {
    clearHide();
    hideTimeout.current = window.setTimeout(() => setHovered(false), 200);
  };

  useEffect(() => {
    return () => clearHide();
  }, [clearHide]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  const handleOptionsKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen((o) => !o);
    }
  };

  const handleTileClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="
        relative flex w-24 flex-col items-center gap-1
        rounded-lg bg-bgColor-secondary p-2 transition
        hover:bg-bgColor-tertiary
      "
      data-testid={dataTestId}
      onMouseEnter={() => {
        clearHide();
        setHovered(true);
      }}
      onMouseLeave={scheduleHide}
      role="group"
    >
      {/* Top row: Drag handle and options - non-clickable */}
      <div className="flex w-full flex-end justify-between">
        {/* Drag handle */}
        <div
          data-testid="drag-handle-button"
          {...dragHandleProps}
          aria-label="Drag handle"
          className={`cursor-grab p-2 min-w-[24px] min-h-[24px] flex items-center justify-center text-xs ${hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <GripVertical size={12} />
        </div>

        {/* Options button - aligned to right */}
        <button
          className="p-2 min-w-[24px] min-h-[24px] flex items-center justify-center text-fgColor-secondary hover:text-fgColor-primary cursor-pointer"
          data-testid="item-options-button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          onKeyDown={handleOptionsKeyDown}
          ref={menuRef}
          type="button"
        >
          <MoreVertical size={12} />
        </button>

        {menuOpen && (
          <Menu anchorRef={menuRef} onClose={() => setMenuOpen(false)}>
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

      {/* Clickable main content area */}
      <div
        className="z-0 -mt-4 flex flex-col items-center cursor-pointer flex-1 w-full"
        data-testid="grid-item-main-button"
        onClick={handleTileClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        {/* Main icon */}
        <div>
          <div
            className="
              bg-bgColor-tertiary-contrast flex size-14 items-center
              justify-center rounded-lg
            "
          >
            {icon}
          </div>
        </div>

        {/* Text content - max 2 lines, robust wrapping */}
        <p
          className="
          line-clamp-2 h-10 w-full max-w-full overflow-hidden
          break-words break-all hyphens-auto whitespace-normal
          text-center text-xs text-fgColor-primary leading-tight
        "
        >
          {children}
        </p>
      </div>
    </div>
  );
};
