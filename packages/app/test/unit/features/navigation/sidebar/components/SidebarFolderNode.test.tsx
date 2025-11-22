import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';
import { SidebarFolderNode } from '@/features/navigation/sidebar/components/SidebarFolderNode';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/bookmarks/hooks/useBookmarkActions', () => ({
  useBookmarkActions: vi.fn(),
}));

vi.mock('@/features/bookmarks/components/dnd/DroppableFolder', () => ({
  DroppableFolder: ({
    children,
    folderId,
    onDrop,
  }: {
    children: React.ReactNode;
    folderId: string;
    onDrop: (id: string, fromFolderId: string, fromIndex: number) => void;
  }) => (
    <div
      data-testid={`droppable-folder-${folderId}`}
      onClick={() => onDrop('item-1', 'folder-2', 0)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDrop('item-1', 'folder-2', 0);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/features/navigation/sidebar/components/SidebarItem', () => ({
  SidebarItem: ({ label, onClick, isSelected, icon, badge, 'data-testid': dataTestId }: any) => (
    <div
      data-testid={dataTestId}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {icon && <span data-testid={`icon-${dataTestId}`}>{icon}</span>}
      <span>{label}</span>
      {badge && <span data-testid={`badge-${dataTestId}`}>{badge}</span>}
      {isSelected && <span data-testid={`selected-${dataTestId}`}>selected</span>}
    </div>
  ),
}));

vi.mock('@/features/navigation/sidebar/components/TreeElbowItem', () => ({
  TreeElbowItem: ({ children }: { children: React.ReactNode }) => <div data-testid="tree-elbow">{children}</div>,
}));

describe('SidebarFolderNode', () => {
  let mockMove: ReturnType<typeof vi.fn<() => Promise<void>>>;
  let mockToggleFolder: ReturnType<typeof vi.fn<(id: string) => void>>;
  let mockClickFolder: ReturnType<typeof vi.fn<(id: string) => void>>;

  beforeEach(() => {
    mockMove = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    mockToggleFolder = vi.fn<(id: string) => void>();
    mockClickFolder = vi.fn<(id: string) => void>();

    const mockUseBookmarkActions = vi.mocked(useBookmarkActions);
    when(mockUseBookmarkActions).calledWith().thenReturn({
      move: mockMove,
      create: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders folder with no children', () => {
    const folder: IBookmarkItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    expect(screen.getByText('Test Folder')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-folder-item-folder-1')).toBeInTheDocument();
  });

  it('renders folder with children', () => {
    const folder: IBookmarkItem = {
      children: [
        {
          children: [],
          id: 'subfolder-1',
          title: 'Subfolder 1',
        },
      ],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    expect(screen.getByText('Test Folder')).toBeInTheDocument();
  });

  it('renders expanded folder with nested children', () => {
    const folder: IBookmarkItem = {
      children: [
        {
          children: [],
          id: 'subfolder-1',
          title: 'Subfolder 1',
        },
      ],
      id: 'folder-1',
      title: 'Test Folder',
    };

    const { container } = render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set(['folder-1'])}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    expect(screen.getByText('Test Folder')).toBeInTheDocument();
    // Nested folder should be rendered recursively
    expect(container.querySelector('[data-testid="sidebar-folder-item-subfolder-1"]')).toBeInTheDocument();
  });

  it('renders selected folder', () => {
    const folder: IBookmarkItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId="folder-1"
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    expect(screen.getByTestId('selected-sidebar-folder-item-folder-1')).toBeInTheDocument();
  });

  it('calls clickFolder when folder is clicked', () => {
    const folder: IBookmarkItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    const folderItem = screen.getByTestId('sidebar-folder-item-folder-1');
    fireEvent.click(folderItem);

    expect(mockClickFolder).toHaveBeenCalledWith('folder-1');
  });

  it('calls toggleFolder when folder with children is clicked', () => {
    const folder: IBookmarkItem = {
      children: [
        {
          children: [],
          id: 'subfolder-1',
          title: 'Subfolder 1',
        },
      ],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    const folderItem = screen.getByTestId('sidebar-folder-item-folder-1');
    fireEvent.click(folderItem);

    expect(mockToggleFolder).toHaveBeenCalledWith('folder-1');
    expect(mockClickFolder).toHaveBeenCalledWith('folder-1');
  });

  it('does not call toggleFolder when folder without children is clicked', () => {
    const folder: IBookmarkItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    const folderItem = screen.getByTestId('sidebar-folder-item-folder-1');
    fireEvent.click(folderItem);

    expect(mockToggleFolder).toHaveBeenCalledTimes(0);
    expect(mockClickFolder).toHaveBeenCalledWith('folder-1');
  });

  it('handles drop event', async () => {
    const folder: IBookmarkItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    const droppableFolder = screen.getByTestId('droppable-folder-folder-1');
    fireEvent.click(droppableFolder);

    await vi.waitFor(() => {
      expect(mockMove).toHaveBeenCalledWith('item-1', { parentId: 'folder-1' });
    });
  });

  it('renders badge with item and folder count', () => {
    const folder: IBookmarkItem = {
      children: [
        {
          children: [],
          id: 'subfolder-1',
          title: 'Subfolder 1',
        },
        {
          id: 'bookmark-1',
          title: 'Bookmark 1',
          url: 'https://example.com',
        },
      ],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    expect(screen.getByTestId('badge-sidebar-folder-item-folder-1')).toHaveTextContent('2');
  });

  it('renders nested folders with correct level', () => {
    const folder: IBookmarkItem = {
      children: [
        {
          children: [],
          id: 'subfolder-1',
          title: 'Subfolder 1',
        },
      ],
      id: 'folder-1',
      title: 'Test Folder',
    };

    const { container } = render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set(['folder-1'])}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    const listItems = container.querySelectorAll('[role="treeitem"]');
    expect(listItems[0]).toHaveAttribute('aria-level', '1');
  });

  it('renders folder with untitled when title is missing', () => {
    const folder: IBookmarkItem = {
      children: [],
      id: 'folder-1',
      title: '',
    };

    render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set()}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });

  it('filters out non-folder children when rendering nested items', () => {
    const folder: IBookmarkItem = {
      children: [
        {
          children: [],
          id: 'subfolder-1',
          title: 'Subfolder 1',
        },
        {
          id: 'bookmark-1',
          title: 'Bookmark 1',
          url: 'https://example.com',
        },
      ],
      id: 'folder-1',
      title: 'Test Folder',
    };

    const { container } = render(
      <AllProviders>
        <SidebarFolderNode
          clickFolder={mockClickFolder}
          expandedIds={new Set(['folder-1'])}
          folder={folder}
          level={0}
          openFolderId={null}
          toggleFolder={mockToggleFolder}
        />
      </AllProviders>
    );

    // Nested folder should be rendered
    expect(container.querySelector('[data-testid="sidebar-folder-item-subfolder-1"]')).toBeInTheDocument();
    // Bookmark should not be rendered as a nested folder
    expect(container.querySelector('[data-testid="sidebar-folder-item-bookmark-1"]')).not.toBeInTheDocument();
  });
});
