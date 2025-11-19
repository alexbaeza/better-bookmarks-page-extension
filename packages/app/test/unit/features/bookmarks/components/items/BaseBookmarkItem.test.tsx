import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBaseBookmarkItem } from '@/features/bookmarks/components/items/BaseBookmarkItem';
import { AllProviders } from '~test/test-utils';

describe('useBaseBookmarkItem', () => {
  const mockItem = {
    id: '1',
    title: 'Test Item',
    url: 'https://example.com',
  };

  it('should return default values', () => {
    const { result } = renderHook(
      () =>
        useBaseBookmarkItem({
          item: mockItem,
          onEdit: vi.fn(),
          onDelete: vi.fn(),
        }),
      {
        wrapper: AllProviders,
      }
    );

    expect(result.current.dataTestId).toBe('bookmark-item-1');
    expect(result.current.actions).toBeDefined();
    expect(result.current.dragHandle).toBeDefined();
    expect(result.current.hovered).toBe(false);
  });

  it('should use custom dataTestId when provided', () => {
    const { result } = renderHook(
      () =>
        useBaseBookmarkItem({
          item: mockItem,
          dataTestId: 'custom-id',
          onEdit: vi.fn(),
          onDelete: vi.fn(),
        }),
      {
        wrapper: AllProviders,
      }
    );

    expect(result.current.dataTestId).toBe('custom-id');
  });

  it('should call onClick when provided', () => {
    const onClick = vi.fn();
    const { result } = renderHook(
      () =>
        useBaseBookmarkItem({
          item: mockItem,
          onEdit: vi.fn(),
          onDelete: vi.fn(),
          onClick,
        }),
      {
        wrapper: AllProviders,
      }
    );

    result.current.onClick();
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onFolderClick when item is folder and onClick is not provided', () => {
    const onFolderClick = vi.fn();
    const folderItem = { ...mockItem, children: [] };
    const { result } = renderHook(
      () =>
        useBaseBookmarkItem({
          item: folderItem,
          onEdit: vi.fn(),
          onDelete: vi.fn(),
          onFolderClick,
        }),
      { wrapper: AllProviders }
    );

    result.current.onClick();
    expect(onFolderClick).toHaveBeenCalledWith(folderItem);
  });

  it('should use folder dataTestId for folders', () => {
    const folderItem = { ...mockItem, children: [] };
    const { result } = renderHook(
      () =>
        useBaseBookmarkItem({
          item: folderItem,
          onEdit: vi.fn(),
          onDelete: vi.fn(),
        }),
      {
        wrapper: AllProviders,
      }
    );

    expect(result.current.dataTestId).toBe('bookmark-folder-item-1');
  });
});
