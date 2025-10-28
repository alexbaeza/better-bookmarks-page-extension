import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

export const useDragStyles = (transform: any, transition: any, isGhost: boolean, isDragging: boolean, isGrid?: boolean) => {
  return useMemo(
    () => ({
      height: 'auto',
      opacity: isGhost ? 0.3 : isDragging ? 0.8 : 1,
      transform: CSS.Transform.toString(transform),
      transition,
      width: isGrid ? '85%' : '100%',
    }),
    [transform, transition, isGhost, isDragging, isGrid]
  );
};
