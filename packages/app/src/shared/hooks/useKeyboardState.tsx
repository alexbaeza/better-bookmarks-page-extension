import { useEffect, useState } from 'react';

import { usePlatform } from './usePlatform';

const normalizeKey = (key: string): string => {
  return key === 'control' ? 'ctrl' : key === 'meta' ? 'meta' : key.toLowerCase();
};

const addModifierKeys = (pressedKeys: Set<string>, isMac: boolean, event: KeyboardEvent): void => {
  // Track modifier keys via flags
  if (isMac && event.metaKey) {
    pressedKeys.add('meta');
  } else if (event.ctrlKey) {
    pressedKeys.add('ctrl');
  }
  if (event.shiftKey) {
    pressedKeys.add('shift');
  }
};

const removeModifierKeys = (pressedKeys: Set<string>, event: KeyboardEvent): void => {
  // Remove modifier keys based on flags
  if (!event.metaKey) pressedKeys.delete('meta');
  if (!event.ctrlKey) pressedKeys.delete('ctrl');
  if (!event.shiftKey) pressedKeys.delete('shift');
};

const clearStuckKeys = (pressedKeys: Set<string>, normalizedTargetKeys: string[]): void => {
  // Clear regular keys to prevent stuck keys (not modifier keys themselves)
  normalizedTargetKeys.forEach((targetKey) => {
    if (targetKey !== 'meta' && targetKey !== 'ctrl' && targetKey !== 'shift') {
      pressedKeys.delete(targetKey);
    }
  });
};

/**
 * Hook to track keyboard state for specific keys
 * Useful for highlighting keyboard shortcuts as they're pressed
 */
export const useKeyboardState = (targetKeys: string[]): Set<string> => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { isMac } = usePlatform();

  // Normalize target keys to lowercase for comparison
  const normalizedTargetKeys = targetKeys.map((key) => key.toLowerCase());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      setPressedKeys((prev) => {
        const next = new Set(prev);

        addModifierKeys(next, isMac, event);

        // Track regular keys (case-insensitive, normalized to lowercase)
        const normalizedKey = normalizeKey(key);
        if (normalizedTargetKeys.includes(normalizedKey)) {
          next.add(normalizedKey);
        }

        return next;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      setPressedKeys((prev) => {
        const next = new Set(prev);

        removeModifierKeys(next, event);

        // Remove regular keys (case-insensitive)
        const normalizedKey = normalizeKey(key);
        if (normalizedTargetKeys.includes(normalizedKey)) {
          next.delete(normalizedKey);
        }

        // If no modifiers are pressed, also clear regular keys to prevent stuck keys
        if (!(event.metaKey || event.ctrlKey || event.shiftKey)) {
          clearStuckKeys(next, normalizedTargetKeys);
        }

        return next;
      });
    };

    // Clean up on window blur to reset state
    const handleBlur = () => {
      setPressedKeys(new Set());
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [normalizedTargetKeys, isMac]);

  return pressedKeys;
};

/**
 * Hook specifically for tracking Cmd/Ctrl+Shift+K shortcut
 */
export const useSearchShortcutState = (): {
  isModifierPressed: boolean;
  isShiftPressed: boolean;
  isKPressed: boolean;
} => {
  const pressedKeys = useKeyboardState(['meta', 'ctrl', 'shift', 'k']);

  const isModifierPressed = pressedKeys.has('meta') || pressedKeys.has('ctrl');
  const isShiftPressed = pressedKeys.has('shift');
  const isKPressed = pressedKeys.has('k');

  return {
    isModifierPressed,
    isShiftPressed,
    isKPressed,
  };
};
