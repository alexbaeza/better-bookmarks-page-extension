import type React from 'react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useClickOutside } from './hooks/useClickOutside';

export interface MenuProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
}

export const Menu: React.FC<MenuProps> = ({ onMouseEnter, onMouseLeave, onClose, anchorRef, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [desiredPos, setDesiredPos] = useState({ left: 0, top: 0 });
  const [actualPos, setActualPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setDesiredPos({ left: rect.right, top: rect.bottom });
  }, [anchorRef]);

  useClickOutside(menuRef, () => onClose?.());

  useEffect(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;

    const { offsetWidth: w, offsetHeight: h } = menuEl;
    const margin = 8; // breathing room
    let left = desiredPos.left;
    let top = desiredPos.top;

    if (left + w + margin > window.innerWidth) {
      const anchor = anchorRef.current;
      left = Math.max(margin, desiredPos.left - w - (anchor?.offsetWidth ?? 0));
    }
    if (top + h + margin > window.innerHeight) {
      const anchor = anchorRef.current;
      top = Math.max(margin, desiredPos.top - h - (anchor?.offsetHeight ?? 0));
    }

    setActualPos({ left, top });
  }, [desiredPos, anchorRef]);

  const menuRoot = document.getElementById('bookmark-menu-portal');
  if (!menuRoot) return null;

  return createPortal(
    <div
      aria-label="Item options menu"
      className="w-40 rounded bg-bgColor-tertiary p-2 shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={menuRef}
      role="menu"
      style={{
        left: actualPos.left,
        position: 'absolute',
        top: actualPos.top,
        zIndex: 1000,
      }}
    >
      {children}
    </div>,
    menuRoot
  );
};
