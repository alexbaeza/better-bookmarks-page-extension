import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import type React from 'react';
import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface BookmarkItemMenuProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
}

export const BookmarkItemMenu: React.FC<BookmarkItemMenuProps> = ({ onMouseEnter, onMouseLeave, onClose, anchorRef, children }) => {
  const { refs, floatingStyles, context } = useFloating({
    placement: 'top-end',
    middleware: [
      offset(4), // Small gap between anchor and menu
      flip(), // Flip to opposite side if there's no room
      shift({ padding: 8 }), // Shift to stay within viewport
    ],
    whileElementsMounted: autoUpdate,
    open: true,
    onOpenChange: (open) => {
      if (!open) {
        onClose?.();
      }
    },
  });

  // Set reference element
  useEffect(() => {
    if (anchorRef.current) {
      refs.setReference(anchorRef.current);
    }
  }, [anchorRef, refs]);

  // Use Floating UI's dismiss hook for auto-close behavior
  const { getFloatingProps } = useInteractions([
    useDismiss(context, {
      outsidePress: true, // Close when clicking outside
      escapeKey: true, // Close on Escape key
      outsidePressEvent: 'mousedown', // Use mousedown for better UX
      referencePress: true, // Close when clicking the anchor button again
    }),
  ]);

  const menuRoot = document.getElementById('bookmark-menu-portal');
  if (!menuRoot) return null;

  // Handle hover to maintain hover state on the parent item
  const handleMouseEnter = () => {
    onMouseEnter?.(); // Keep parent item hovered so options button stays visible
  };

  const handleMouseLeave = () => {
    onMouseLeave?.(); // Allow parent item to unhover when leaving menu
  };

  return createPortal(
    <div
      {...getFloatingProps()}
      aria-label="Item options menu"
      className="w-40 rounded bg-bgColor-secondary p-2 shadow-lg border border-bgColor-tertiary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={refs.setFloating}
      role="menu"
      style={{
        ...floatingStyles,
        position: 'fixed',
        zIndex: 1000,
      }}
    >
      {children}
    </div>,
    menuRoot
  );
};
