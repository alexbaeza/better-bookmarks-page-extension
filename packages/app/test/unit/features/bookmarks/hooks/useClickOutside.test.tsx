import { renderHook } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClickOutside } from '@/features/bookmarks/hooks/useClickOutside';

describe('useClickOutside', () => {
  let mockHandler: ReturnType<typeof vi.fn<() => void>>;
  let containerRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    mockHandler = vi.fn<() => void>();
    containerRef = { current: document.createElement('div') };
    document.body.appendChild(containerRef.current);
  });

  afterEach(() => {
    if (containerRef.current) {
      document.body.removeChild(containerRef.current);
    }
  });

  it('should call handler when clicking outside element', () => {
    renderHook(() => useClickOutside(containerRef, mockHandler));

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });

  it('should not call handler when clicking inside element', () => {
    renderHook(() => useClickOutside(containerRef, mockHandler));

    const insideElement = document.createElement('div');
    containerRef.current?.appendChild(insideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    insideElement.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should call handler when Escape key is pressed', () => {
    renderHook(() => useClickOutside(containerRef, mockHandler));

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalled();
  });

  it('should not call handler when other keys are pressed', () => {
    renderHook(() => useClickOutside(containerRef, mockHandler));

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    document.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useClickOutside(containerRef, mockHandler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should handle null ref gracefully', () => {
    const nullRef = { current: null };

    renderHook(() => useClickOutside(nullRef, mockHandler));

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    outsideElement.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });
});
