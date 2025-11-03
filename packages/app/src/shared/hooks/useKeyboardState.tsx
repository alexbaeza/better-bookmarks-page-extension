import { useEffect, useState } from 'react';

import { usePlatform } from './usePlatform';

/**
 * Hook to track keyboard state for specific keys
 * Useful for highlighting keyboard shortcuts as they're pressed
 */
export function useKeyboardState(targetKeys: string[]): Set<string> {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { isMac } = usePlatform();

  // Normalize target keys to lowercase for comparison
  const normalizedTargetKeys = targetKeys.map((k) => k.toLowerCase());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      setPressedKeys((prev) => {
        const next = new Set(prev);

        // Track modifier keys via flags
        if (isMac && event.metaKey) {
          next.add('meta');
        } else if (event.ctrlKey) {
          next.add('ctrl');
        }
        if (event.shiftKey) {
          next.add('shift');
        }

        // Track regular keys (case-insensitive, normalized to lowercase)
        const normalizedKey = key === 'control' ? 'ctrl' : key === 'meta' ? 'meta' : key;
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

        // Remove modifier keys based on flags
        if (!event.metaKey) next.delete('meta');
        if (!event.ctrlKey) next.delete('ctrl');
        if (!event.shiftKey) next.delete('shift');

        // Remove regular keys (case-insensitive)
        const normalizedKey = key === 'control' ? 'ctrl' : key === 'meta' ? 'meta' : key.toLowerCase();
        if (normalizedTargetKeys.includes(normalizedKey)) {
          next.delete(normalizedKey);
        }

        // If no modifiers are pressed, also clear regular keys to prevent stuck keys
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey) {
          normalizedTargetKeys.forEach((targetKey) => {
            // Only clear regular keys (not modifier keys themselves)
            if (targetKey !== 'meta' && targetKey !== 'ctrl' && targetKey !== 'shift') {
              next.delete(targetKey);
            }
          });
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
}

/**
 * Hook specifically for tracking Cmd/Ctrl+Shift+K shortcut
 */
export function useSearchShortcutState(): {
  isModifierPressed: boolean;
  isShiftPressed: boolean;
  isKPressed: boolean;
} {
  const pressedKeys = useKeyboardState(['meta', 'ctrl', 'shift', 'k']);

  const isModifierPressed = pressedKeys.has('meta') || pressedKeys.has('ctrl');
  const isShiftPressed = pressedKeys.has('shift');
  const isKPressed = pressedKeys.has('k');

  return {
    isModifierPressed,
    isShiftPressed,
    isKPressed,
  };
}
