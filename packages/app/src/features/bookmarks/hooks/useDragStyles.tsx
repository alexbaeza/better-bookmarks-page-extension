import type React from 'react';

export interface UseDragStylesOptions {
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
  transition: string | null;
  isGhost: boolean;
  isDragging: boolean;
  isVisible: boolean;
}

/**
 * Hook for calculating drag styles
 * @param transform - Transform object from dnd-kit
 * @param transition - Transition string
 * @param isGhost - Whether this is a ghost overlay
 * @param isDragging - Whether the item is currently being dragged
 * @param isVisible - Whether the item should be visible
 * @returns CSS styles for the dragged item
 */
export function useDragStyles(
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null,
  transition: string | null,
  isGhost: boolean,
  isDragging: boolean,
  isVisible: boolean
): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scaleX}, ${transform.scaleY})` : undefined,
    transition: transition || undefined,
    opacity: isGhost ? 0.5 : isDragging ? 0.5 : 1,
    visibility: isVisible ? 'visible' : 'hidden',
  };

  return baseStyle;
}
