import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseHoverOptions {
  hideDelay?: number;
}

export function useHover(options: UseHoverOptions = {}) {
  const { hideDelay = 200 } = options;
  const [hovered, setHovered] = useState(false);
  const hideTimeout = useRef<number | undefined>(undefined);

  const clearHide = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = undefined;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHide();
    hideTimeout.current = window.setTimeout(() => setHovered(false), hideDelay);
  }, [clearHide, hideDelay]);

  useEffect(() => {
    return () => clearHide();
  }, [clearHide]);

  const handleMouseEnter = useCallback(() => {
    clearHide();
    setHovered(true);
  }, [clearHide]);

  const handleMouseLeave = scheduleHide;

  return {
    hovered,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
}
