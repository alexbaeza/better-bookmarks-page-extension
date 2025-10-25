import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { SidebarFolderNode } from '@/features/navigation/sidebar/components/SidebarFolderNode';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

const makeFolder = (overrides: Partial<IBookmarkItem> = {}): IBookmarkItem => ({
  id: 'f1',
  title: 'Folder',
  dateAdded: Date.now(),
  children: [],
  ...overrides,
});

describe('SidebarFolderNode', () => {
  it('renders a folder row', () => {
    render(
      <ul>
        <SidebarFolderNode
          folder={makeFolder()}
          level={0}
          expandedIds={new Set()}
          toggleFolder={() => {}}
          openFolderId={null}
          clickFolder={() => {}}
        />
      </ul>
    );
    expect(screen.getByText('Folder')).toBeInTheDocument();
  });

  it('shows children when expanded', () => {
    const child: IBookmarkItem = makeFolder({ id: 'f2', title: 'Child', children: [] });
    const root: IBookmarkItem = makeFolder({ children: [child] });
    render(
      <ul>
        <SidebarFolderNode
          folder={root}
          level={0}
          expandedIds={new Set([root.id])}
          toggleFolder={() => {}}
          openFolderId={null}
          clickFolder={() => {}}
        />
      </ul>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});


