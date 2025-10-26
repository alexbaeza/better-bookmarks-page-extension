import { vi } from 'vitest';

import { viewModeAtom } from '@/app/providers/atoms';
import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { BookmarkContentRenderer } from '@/features/bookmarks/containers/BookmarkContentRenderer';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { render, screen } from '~test/test-utils';

vi.mock('@/app/providers/dragdrop-provider', () => ({
  useDragDrop: vi.fn(),
}));

describe('BookmarkContentRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const _mockUseDragDrop = vi.mocked(useDragDrop);
  });

  it('renders in list mode', () => {
    const mockItems = [
      { id: '1', title: 'Item 1', url: 'http://example.com' },
      { id: '2', title: 'Item 2', url: 'http://example2.com' },
    ];

    vi.mocked(useDragDrop).mockReturnValue({ activeId: null });

    render(<BookmarkContentRenderer folderContents={mockItems} folderId="folder1" />, {
      initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
    });

    const container = screen.getByTestId('bookmark-content-container-folder1');
    expect(container).toHaveAttribute('data-folder-id', 'folder1');
    expect(container).toHaveClass('gap-2');
  });

  it('renders in grid mode', () => {
    const mockItems = [{ id: '1', title: 'Item 1', url: 'http://example.com' }];

    vi.mocked(useDragDrop).mockReturnValue({ activeId: null });

    render(<BookmarkContentRenderer folderContents={mockItems} folderId="folder1" />, {
      initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
    });

    const container = screen.getByTestId('bookmark-content-container-folder1');
    expect(container).toHaveClass('grid gap-2 p-4');
  });

  it('passes isGhost to DraggableBookmarkItem when item is active', () => {
    const mockItems = [{ id: '1', title: 'Item 1', url: 'http://example.com' }];

    vi.mocked(useDragDrop).mockReturnValue({ activeId: '1' });

    render(<BookmarkContentRenderer folderContents={mockItems} folderId="folder1" />, {
      initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
    });

    const container = screen.getByTestId('bookmark-content-container-folder1');
    expect(container).toHaveAttribute('data-folder-id', 'folder1');
  });
});
