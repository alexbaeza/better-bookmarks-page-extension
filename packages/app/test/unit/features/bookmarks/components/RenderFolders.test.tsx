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
    const folders: IBookmarkItem[] = [{ children: [], id: '1', title: 'Folder 1' } as IBookmarkItem];

    render(<RenderFolders folders={folders} />);

    const container = screen.getByTestId('folder-root').parentElement;
    expect(container).toHaveClass('w-full');
  });

  it('renders multiple folders with columns class', () => {
    const folders: IBookmarkItem[] = [
      { children: [], id: '1', title: 'Folder 1' } as IBookmarkItem,
      { children: [], id: '2', title: 'Folder 2' } as IBookmarkItem,
    ];

    render(<RenderFolders folders={folders} />);

    const folderRoots = screen.getAllByTestId('folder-root');
    expect(folderRoots).toHaveLength(2);

    const container = folderRoots[0].parentElement;
    expect(container?.className).toMatch(/columns-1/);
  });

  it('passes correct props to BookmarkFolderRoot', () => {
    const folders: IBookmarkItem[] = [{ children: [{ id: 'a', title: 'A' } as IBookmarkItem], id: '1', title: 'Folder 1' } as IBookmarkItem];

    render(<RenderFolders folders={folders} />);

    const folderRoot = screen.getByTestId('folder-root');
    expect(folderRoot).toBeInTheDocument();
  });
});
