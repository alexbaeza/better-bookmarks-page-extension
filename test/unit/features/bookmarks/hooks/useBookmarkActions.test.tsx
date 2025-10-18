import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { useAppStateContext } from '@/app/providers/app-state-context';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';

vi.mock('@/app/providers/app-state-context');
vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  move: vi.fn(),
}));

type AppStateContextReturn = {
  refreshBookmarks: () => void;
  updateBookmarkLayout: (folders: unknown[]) => void;
};

describe('useBookmarkActions', () => {
  let mockAppStateContext: vi.MockedFunction<typeof useAppStateContext>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAppStateContext = vi.mocked(useAppStateContext);
  });

  it('returns all required action functions', () => {
    when(mockAppStateContext)
      .calledWith()
      .thenReturn({
        refreshBookmarks: vi.fn(),
        updateBookmarkLayout: vi.fn(),
      } as AppStateContextReturn);

    const { result } = renderHook(() => useBookmarkActions());

    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
    expect(typeof result.current.remove).toBe('function');
    expect(typeof result.current.move).toBe('function');
    expect(typeof result.current.updateLayout).toBe('function');
  });

  it('returns updateLayout from context', () => {
    when(mockAppStateContext)
      .calledWith()
      .thenReturn({
        refreshBookmarks: vi.fn(),
        updateBookmarkLayout: vi.fn(),
      } as AppStateContextReturn);

    const { result } = renderHook(() => useBookmarkActions());

    expect(result.current.updateLayout).toBeDefined();
    expect(typeof result.current.updateLayout).toBe('function');
  });
});
