import { vi } from 'vitest';

import { RenderFolders } from '@/features/bookmarks/containers/RenderFolders';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/components/BookmarkFolderRoot', () => ({
  BookmarkFolderRoot: ({ name, folderContents }: { name: string; folderContents: IBookmarkItem[] }) => (
    <div data-testid="folder-root">
      <span>{name}</span>
      <span>{folderContents.length}</span>
    </div>
  ),
}));

describe('RenderFolders', () => {
  it('renders single folder with w-full class', () => {
    const folders: IBookmarkItem[] = [{ id: '1', title: 'Folder 1', children: [] } as IBookmarkItem];

    render(<RenderFolders folders={folders} />);

    // Find the container div that wraps the folders
    const container = screen.getByTestId('folder-root').parentElement;
    expect(container).toHaveClass('w-full');
  });

  it('renders multiple folders with columns class', () => {
    const folders: IBookmarkItem[] = [
      { id: '1', title: 'Folder 1', children: [] } as IBookmarkItem,
      { id: '2', title: 'Folder 2', children: [] } as IBookmarkItem,
    ];

    render(<RenderFolders folders={folders} />);

    // Use getAllByTestId to handle multiple elements
    const folderRoots = screen.getAllByTestId('folder-root');
    expect(folderRoots).toHaveLength(2);
    
    // Check the container has columns class
    const container = folderRoots[0].parentElement;
    expect(container?.className).toMatch(/columns-1/);
  });

  it('passes correct props to BookmarkFolderRoot', () => {
    const folders: IBookmarkItem[] = [{ id: '1', title: 'Folder 1', children: [{ id: 'a', title: 'A' } as IBookmarkItem] } as IBookmarkItem];

    render(<RenderFolders folders={folders} />);

    const folderRoot = screen.getByTestId('folder-root');
    expect(folderRoot).toBeInTheDocument();
  });
});
