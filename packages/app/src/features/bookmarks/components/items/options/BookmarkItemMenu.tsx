import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { zoomAtom } from '@/app/providers/atoms';

export interface BookmarkItemMenuProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
}

export const BookmarkItemMenu: React.FC<BookmarkItemMenuProps> = ({
  onMouseEnter,
  onMouseLeave,
  onClose,
  anchorRef,
  children,
}) => {
  const zoom = useAtomValue(zoomAtom);
  const { refs, floatingStyles, context, update } = useFloating({
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

  // Reposition menu when zoom changes
  // Note: CSS zoom changes don't trigger autoUpdate events, so we manually trigger
  // repositioning when zoom changes. Using zoom value to ensure effect runs on change.
  useEffect(() => {
    if (!update) return;
    // Use requestAnimationFrame to ensure DOM has updated after zoom change
    // Access zoom to include it in the dependency tracking
    const currentZoom = zoom;
    const rafId = requestAnimationFrame(() => {
      update();
    });
    return () => {
      cancelAnimationFrame(rafId);
      // Reference zoom to ensure effect tracks it
      void currentZoom;
    };
  }, [zoom, update]);

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
