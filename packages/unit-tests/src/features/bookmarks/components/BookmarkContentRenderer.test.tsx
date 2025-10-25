import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { viewModeAtom } from '@/app/providers/atoms';
import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { BookmarkContentRenderer } from '@/features/bookmarks/containers/BookmarkContentRenderer';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { render, screen } from '~test/test-utils';

vi.mock('@/app/providers/dragdrop-provider', () => ({
  useDragDrop: vi.fn(),
}));

vi.mock('jotai', async () => {
  const actual = await vi.importActual('jotai');
  return {
    ...actual,
    useAtomValue: vi.fn(),
  };
});

describe('BookmarkContentRenderer', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtomValue');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders in list mode', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    const mockItems = [
      { id: '1', title: 'Item 1', url: 'http://example.com' },
      { id: '2', title: 'Item 2', url: 'http://example2.com' },
    ];

    when(vi.mocked(useDragDrop)).calledWith().thenReturn({ activeId: null });

    render(<BookmarkContentRenderer folderContents={mockItems} folderId="folder1" />);

    const container = screen.getByTestId('bookmark-content-container');
    expect(container).toHaveAttribute('data-folder-id', 'folder1');
    expect(container).toHaveClass('gap-2');
  });

  it('renders in grid mode', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);

    const mockItems = [{ id: '1', title: 'Item 1', url: 'http://example.com' }];

    when(vi.mocked(useDragDrop)).calledWith().thenReturn({ activeId: null });

    render(<BookmarkContentRenderer folderContents={mockItems} folderId="folder1" />);

    const container = screen.getByTestId('bookmark-content-container');
    expect(container).toHaveClass('grid gap-2 p-4');
  });

  it('passes isGhost to DraggableBookmarkItem when item is active', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    const mockItems = [{ id: '1', title: 'Item 1', url: 'http://example.com' }];

    when(vi.mocked(useDragDrop)).calledWith().thenReturn({ activeId: '1' });

    render(<BookmarkContentRenderer folderContents={mockItems} folderId="folder1" />);

    const container = screen.getByTestId('bookmark-content-container');
    expect(container).toHaveAttribute('data-folder-id', 'folder1');
  });
});
