import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCallback } from 'react';

export const useDragDroppable = (id: string, disabled = false) => {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id });
  const { setNodeRef: setDragRef, isDragging } = useDraggable({ id, disabled });

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDropRef(node);
      setDragRef(node);
    },
    [setDropRef, setDragRef]
  );

  return { setNodeRef, isOver, isDragging };
};
