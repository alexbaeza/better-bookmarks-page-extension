import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useKeyboardState, useSearchShortcutState } from '@/shared/hooks/useKeyboardState';

describe('useKeyboardState', () => {
  it('should initialize with empty set', () => {
    const { result } = renderHook(() => useKeyboardState(['a', 'b']));
    expect(result.current.size).toBe(0);
  });

  it('should track keydown events', async () => {
    const { result } = renderHook(() => useKeyboardState(['a', 'b']));

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    document.dispatchEvent(keyDownEvent);

    await waitFor(() => {
      expect(result.current.has('a')).toBe(true);
    });
  });

  it('should track keyup events', async () => {
    const { result } = renderHook(() => useKeyboardState(['a']));

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    document.dispatchEvent(keyDownEvent);

    await waitFor(() => {
      expect(result.current.has('a')).toBe(true);
    });

    const keyUpEvent = new KeyboardEvent('keyup', { key: 'a', bubbles: true });
    document.dispatchEvent(keyUpEvent);

    await waitFor(() => {
      expect(result.current.has('a')).toBe(false);
    });
  });

  it('should track modifier keys', async () => {
    const { result } = renderHook(() => useKeyboardState(['ctrl']));

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true, bubbles: true });
    document.dispatchEvent(keyDownEvent);

    await waitFor(() => {
      expect(result.current.has('ctrl')).toBe(true);
    });
  });

  it('should normalize keys to lowercase', async () => {
    const { result } = renderHook(() => useKeyboardState(['a']));

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'A', bubbles: true });
    document.dispatchEvent(keyDownEvent);

    await waitFor(() => {
      expect(result.current.has('a')).toBe(true);
    });
  });

  it('should reset on window blur', async () => {
    const { result } = renderHook(() => useKeyboardState(['a']));

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    document.dispatchEvent(keyDownEvent);

    await waitFor(() => {
      expect(result.current.has('a')).toBe(true);
    });

    window.dispatchEvent(new Event('blur'));

    await waitFor(() => {
      expect(result.current.size).toBe(0);
    });
  });

  describe('useSearchShortcutState', () => {
    it('should initialize with all keys not pressed', () => {
      const { result } = renderHook(() => useSearchShortcutState());
      expect(result.current.isModifierPressed).toBe(false);
      expect(result.current.isShiftPressed).toBe(false);
      expect(result.current.isKPressed).toBe(false);
    });

    it('should track modifier key press', async () => {
      const { result } = renderHook(() => useSearchShortcutState());

      const keyDownEvent = new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true, bubbles: true });
      document.dispatchEvent(keyDownEvent);

      await waitFor(() => {
        expect(result.current.isModifierPressed).toBe(true);
      });
    });

    it('should track shift key press', async () => {
      const { result } = renderHook(() => useSearchShortcutState());

      const keyDownEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true, bubbles: true });
      document.dispatchEvent(keyDownEvent);

      await waitFor(() => {
        expect(result.current.isShiftPressed).toBe(true);
      });
    });

    it('should track k key press', async () => {
      const { result } = renderHook(() => useSearchShortcutState());

      const keyDownEvent = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
      document.dispatchEvent(keyDownEvent);

      await waitFor(() => {
        expect(result.current.isKPressed).toBe(true);
      });
    });
  });
});
