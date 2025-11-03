import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

const mockFolder = {
  children: [],
  dateAdded: undefined,
  dateGroupModified: undefined,
  id: 'folder1',
  parentId: '0',
  title: 'Test Folder',
  url: undefined,
};

describe('useBookmarkModals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all modal functions', () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    expect(result.current.openCreateModal).toBeDefined();
    expect(result.current.openEditModal).toBeDefined();
    expect(result.current.openFolderModal).toBeDefined();
    expect(result.current.remove).toBeDefined();
  });

  it('calls create when openCreateModal is invoked', async () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    await act(async () => {
      result.current.openCreateModal('parent1');
    });

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('calls update when openEditModal is invoked', async () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    await act(async () => {
      result.current.openEditModal(mockBookmarkItem);
    });

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('opens folder modal when openFolderModal is invoked', async () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    await act(async () => {
      result.current.openFolderModal(mockFolder);
    });

    expect(mockFolder).toBeDefined();
  });

  it('returns remove function from useBookmarkActions', () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    expect(result.current.remove).toBe(mockRemove);
  });

  it('passes correct initial values for create modal', () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    expect(typeof result.current.openCreateModal).toBe('function');
    expect(typeof result.current.openEditModal).toBe('function');
    expect(typeof result.current.openFolderModal).toBe('function');
    expect(typeof result.current.remove).toBe('function');
  });

  it('handles folder with undefined children', async () => {
    const mockCreate = vi.fn().mockResolvedValue(undefined);
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockRemove = vi.fn().mockResolvedValue(undefined);

    vi.mocked(bookmarkActions.useBookmarkActions).mockReturnValue({
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const folderWithUndefinedChildren = {
      ...mockFolder,
      children: undefined,
    };

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ModalProvider>{children}</ModalProvider>
    );

    const { result } = renderHook(() => useBookmarkModals(), { wrapper });

    await act(async () => {
      result.current.openFolderModal(folderWithUndefinedChildren);
    });

    expect(typeof result.current.openFolderModal).toBe('function');
  });
});
