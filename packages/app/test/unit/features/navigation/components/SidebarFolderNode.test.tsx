import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SidebarFolderNode } from '@/features/navigation/sidebar/components/SidebarFolderNode';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

const makeFolder = (overrides: Partial<IBookmarkItem> = {}): IBookmarkItem => ({
  children: [],
  dateAdded: Date.now(),
  id: 'f1',
  title: 'Folder',
  ...overrides,
});

describe('SidebarFolderNode', () => {
  it('renders a folder row', () => {
    render(
      <ul>
        <SidebarFolderNode clickFolder={() => {}} expandedIds={new Set()} folder={makeFolder()} level={0} openFolderId={null} toggleFolder={() => {}} />
      </ul>
    );
    expect(screen.getByText('Folder')).toBeInTheDocument();
  });

  it('shows children when expanded', () => {
    const child: IBookmarkItem = makeFolder({ children: [], id: 'f2', title: 'Child' });
    const root: IBookmarkItem = makeFolder({ children: [child] });
    render(
      <ul>
        <SidebarFolderNode clickFolder={() => {}} expandedIds={new Set([root.id])} folder={root} level={0} openFolderId={null} toggleFolder={() => {}} />
      </ul>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('calls toggleFolder when a folder with children is clicked', () => {
    const toggleFolderMock = vi.fn();
    const child: IBookmarkItem = makeFolder({ children: [], id: 'f2', title: 'Child' });
    const root: IBookmarkItem = makeFolder({ children: [child], id: 'f1' });

    render(
      <ul>
        <SidebarFolderNode clickFolder={() => {}} expandedIds={new Set()} folder={root} level={0} openFolderId={null} toggleFolder={toggleFolderMock} />
      </ul>
    );

    const folderButton = screen.getByTestId('sidebar-folder-item-f1');
    fireEvent.click(folderButton);

    expect(toggleFolderMock).toHaveBeenCalledWith('f1');
  });

  it('does not call toggleFolder when a folder without children is clicked', () => {
    const toggleFolderMock = vi.fn();
    const root: IBookmarkItem = makeFolder({ id: 'f1' });

    render(
      <ul>
        <SidebarFolderNode clickFolder={() => {}} expandedIds={new Set()} folder={root} level={0} openFolderId={null} toggleFolder={toggleFolderMock} />
      </ul>
    );

    const folderButton = screen.getByTestId('sidebar-folder-item-f1');
    fireEvent.click(folderButton);

    expect(toggleFolderMock).not.toHaveBeenCalled();
  });
});
