import { vi } from 'vitest';
import { when } from 'vitest-when';

import { FolderPage } from '@/app/routing/Folder';
import { render } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));
vi.mock('@/features/bookmarks/containers/Content', () => ({
  Content: () => <div data-testid="content">Content</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

const mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);

describe('FolderPage', () => {
  it('calls setCurrentPage with folderId on mount', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation).calledWith().thenReturn({
      currentPage: 'test-folder',
      setCurrentPage,
    });

    render(<FolderPage folderId="test-folder" />);

    expect(setCurrentPage).toHaveBeenCalledWith('test-folder');
  });

  it('does not call setCurrentPage if folderId is undefined', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation).calledWith().thenReturn({
      currentPage: 'All',
      setCurrentPage,
    });

    render(<FolderPage folderId="" />);

    expect(setCurrentPage).not.toHaveBeenCalled();
  });
});
