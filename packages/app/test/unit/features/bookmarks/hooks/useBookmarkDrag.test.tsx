import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBookmarkDrag } from '@/features/bookmarks/hooks/useBookmarkDrag';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

// Mock dependencies
const mockUseSortable = vi.fn();
const mockUseAtomValue = vi.fn();
const mockUseDragStyles = vi.fn();

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: (...args: any[]) => mockUseSortable(...args),
}));

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>();
  return {
    ...actual,
    useAtomValue: (...args: any[]) => mockUseAtomValue(...args),
  };
});

vi.mock('@/features/bookmarks/hooks/useDragStyles', () => ({
  useDragStyles: (...args: any[]) => mockUseDragStyles(...args),
}));

vi.mock('@/features/bookmarks/components/items/SkeletonBookmarkItem', () => ({
  SkeletonBookmarkItem: ({ viewMode, dataTestId }: any) => <div data-testid={dataTestId || 'skeleton'}>Skeleton {viewMode}</div>,
}));

describe('useBookmarkDrag', () => {
  const mockItem: IBookmarkItem = {
    id: 'bookmark1',
    title: 'Test Bookmark',
    url: 'https://example.com',
  };

  const mockFolderItem: IBookmarkItem = {
    id: 'folder1',
    title: 'Test Folder',
    children: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSortable.mockReturnValue({
      attributes: { role: 'button' },
      listeners: { onPointerDown: vi.fn() },
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
      isDragging: false,
    });

    mockUseAtomValue.mockReturnValue('grid');
    mockUseDragStyles.mockReturnValue({});
  });

  it('should return drag props for bookmark item', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem }));

    expect(result.current.dragProps).toBeDefined();
    expect(result.current.dragProps).toHaveProperty('ref');
    expect(result.current.dragProps).toHaveProperty('style');
    expect(result.current.dragProps).toHaveProperty('data-testid');
    expect(result.current.dragProps['data-testid']).toBe('bookmark-item-bookmark1');
  });

  it('should return drag props for folder item', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockFolderItem }));

    expect(result.current.dragProps['data-testid']).toBe('bookmark-folder-item-folder1');
  });

  it('should return drag handle props', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem }));

    expect(result.current.dragHandleProps).toBeDefined();
    expect(result.current.dragHandleProps).toHaveProperty('role');
    expect(result.current.dragHandleProps).toHaveProperty('onPointerDown');
  });

  it('should return isDragging state', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem }));

    expect(result.current.isDragging).toBe(false);
  });

  it('should update isDragging state', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: { x: 10, y: 10, scaleX: 1, scaleY: 1 },
      transition: null,
      isDragging: true,
    });

    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem }));

    expect(result.current.isDragging).toBe(true);
  });

  it('should return renderDragOverlay function', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem }));

    expect(typeof result.current.renderDragOverlay).toBe('function');
  });

  it('should render ghost overlay when isGhost is true', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem, isGhost: true }));

    const overlay = result.current.renderDragOverlay();
    expect(overlay).not.toBeNull();
  });

  it('should render normal overlay when isGhost is false', () => {
    const { result } = renderHook(() => useBookmarkDrag({ item: mockItem, isGhost: false }));

    const overlay = result.current.renderDragOverlay();
    expect(overlay).not.toBeNull();
  });

  it('should call useSortable with item id', () => {
    renderHook(() => useBookmarkDrag({ item: mockItem }));

    expect(mockUseSortable).toHaveBeenCalledWith({ id: 'bookmark1' });
  });

  it('should call useDragStyles with correct parameters', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: { x: 10, y: 10, scaleX: 1, scaleY: 1 },
      transition: 'transform 200ms',
      isDragging: false,
    });

    renderHook(() => useBookmarkDrag({ item: mockItem, isGhost: false }));

    expect(mockUseDragStyles).toHaveBeenCalledWith({ x: 10, y: 10, scaleX: 1, scaleY: 1 }, 'transform 200ms', false, false, true);
  });

  it('should call useDragStyles with isGhost true', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
      isDragging: false,
    });

    renderHook(() => useBookmarkDrag({ item: mockItem, isGhost: true }));

    expect(mockUseDragStyles).toHaveBeenCalledWith(null, null, true, false, true);
  });
});
