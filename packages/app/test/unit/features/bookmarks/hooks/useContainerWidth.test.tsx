import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';

let mockDisconnect: ReturnType<typeof vi.fn>;
let mockObserve: ReturnType<typeof vi.fn>;
let mockUnobserve: ReturnType<typeof vi.fn>;

beforeAll(() => {
  mockDisconnect = vi.fn();
  mockObserve = vi.fn();
  mockUnobserve = vi.fn();

  global.ResizeObserver = class MockResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    callback: ResizeObserverCallback;
    disconnect = mockDisconnect;
    observe = mockObserve;
    unobserve = mockUnobserve;
  } as unknown as typeof ResizeObserver;
});

describe('useContainerWidth', () => {
  beforeEach(() => {
    mockDisconnect.mockClear();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns containerRef and containerWidth', () => {
    const { result } = renderHook(() => useContainerWidth());
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerWidth).toBeDefined();
    expect(typeof result.current.containerWidth).toBe('number');
  });

  it('sets initial width to 0', () => {
    const { result } = renderHook(() => useContainerWidth());
    expect(result.current.containerWidth).toBe(0);
  });

  it('disconnects ResizeObserver on unmount', () => {
    const { unmount } = renderHook(() => useContainerWidth());

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
