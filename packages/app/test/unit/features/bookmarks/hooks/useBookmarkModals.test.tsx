import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';

import { ModalProvider } from '@/app/providers/modal-context';
import * as bookmarkActions from '@/features/bookmarks/hooks/useBookmarkActions';
import { useBookmarkModals } from '@/features/bookmarks/hooks/useBookmarkModals';

vi.mock('@/features/bookmarks/hooks/useBookmarkActions');

const mockBookmarkItem = {
  children: undefined,
  dateAdded: undefined,
  dateGroupModified: undefined,
  id: '1',
  parentId: '0',
  title: 'Test Bookmark',
  url: 'https://example.com',
};

describe('useBookmarkModals', () => {
  let mockCreate: ReturnType<typeof vi.fn>;
  let mockUpdate: ReturnType<typeof vi.fn>;
  let mockRemove: ReturnType<typeof vi.fn>;
  let mockMove: ReturnType<typeof vi.fn>;
  let mockUpdateLayout: ReturnType<typeof vi.fn>;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    mockCreate = vi.fn();
    mockUpdate = vi.fn();
    mockRemove = vi.fn();
    mockMove = vi.fn();
    mockUpdateLayout = vi.fn();

    when(vi.mocked(bookmarkActions.useBookmarkActions)).calledWith().thenReturn({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: mockMove,
      updateLayout: mockUpdateLayout,
    });

    wrapper = ({ children }) => <ModalProvider>{children}</ModalProvider>;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all modal functions', () => {
    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    expect(result.current.openCreateModal).toBeDefined();
    expect(result.current.openEditModal).toBeDefined();
    expect(result.current.remove).toBeDefined();
  });

  it('does not call create immediately when openCreateModal is invoked', async () => {
    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    await act(async () => {
      result.current.openCreateModal('parent1');
    });

    expect(mockCreate).toHaveBeenCalledTimes(0);
  });

  it('does not call update immediately when openEditModal is invoked', async () => {
    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    await act(async () => {
      result.current.openEditModal(mockBookmarkItem);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(0);
  });

  it('returns remove function from useBookmarkActions', () => {
    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    expect(result.current.remove).toBe(mockRemove);
  });

  it('passes correct initial values for create modal', () => {
    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    expect(typeof result.current.openCreateModal).toBe('function');
    expect(typeof result.current.openEditModal).toBe('function');
    expect(typeof result.current.remove).toBe('function');
  });
});
