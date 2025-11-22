import { FolderDot as FolderDotIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon } from 'lucide-react';
import type React from 'react';
import { memo, useCallback } from 'react';

import { DroppableFolder } from '@/features/bookmarks/components/dnd/DroppableFolder';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';
import { countFolders, countItems, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { SidebarItem } from './SidebarItem';
import { TreeElbowItem } from './TreeElbowItem';

type FolderNodeProps = {
  folder: IBookmarkItem;
  level: number;
  expandedIds: Set<string>;
  toggleFolder: (id: string) => void;
  openFolderId: string | null;
  clickFolder: (id: string) => void;
};

export const SidebarFolderNode: React.FC<FolderNodeProps> = memo(
  ({ folder, level, expandedIds, toggleFolder, openFolderId, clickFolder }) => {
    const { move } = useBookmarkActions();

    const handleDrop = useCallback(
      async (draggedItemId: string, _fromFolderId: string, _fromIndex: number) => {
        // Move bookmark to this sidebar folder
        await move(draggedItemId, { parentId: folder.id });
      },
      [folder.id, move]
    );

    if (!folder) {
      return null;
    }

    const isOpen = expandedIds.has(folder.id);
    const isSelected = openFolderId === folder.id;
    const hasKids = folder.children ? countFolders(folder) > 0 : false;

    const folderIcon = !hasKids ? (
      <FolderDotIcon size={16} />
    ) : isOpen ? (
      <FolderOpenIcon size={16} />
    ) : (
      <FolderIcon size={16} />
    );

    return (
      <li
        aria-level={level + 1}
        aria-selected={isSelected}
        role="treeitem"
        {...(hasKids && { 'aria-expanded': isOpen })}
        className="relative min-w-0"
        tabIndex={0}
      >
        <DroppableFolder folderId={folder.id} onDrop={handleDrop}>
          {/* Folder Row */}
          <SidebarItem
            badge={countItems(folder) + countFolders(folder)}
            className="cursor-pointer"
            data-testid={`sidebar-folder-item-${folder.id}`}
            icon={folderIcon}
            isSelected={isSelected}
            label={folder.title || 'Untitled'}
            onClick={() => {
              if (hasKids) toggleFolder(folder.id);
              clickFolder(folder.id);
            }}
          />
        </DroppableFolder>

        {/* Nested Children */}
        {isOpen && hasKids && folder.children && (
          <fieldset
            aria-label={`Subfolders of ${folder.title || 'Untitled'}`}
            className="relative ml-0 pl-0 overflow-visible min-w-0"
          >
            {/* Vertical spine for this branch */}
            <div className="pointer-events-none absolute inset-y-0 left-3 w-px bg-fgColor-primary" />

            {folder.children.filter(onlyFolders).map((child: IBookmarkItem) => (
              <TreeElbowItem key={child.id}>
                <SidebarFolderNode
                  clickFolder={clickFolder}
                  expandedIds={expandedIds}
                  folder={child}
                  level={level + 1}
                  openFolderId={openFolderId}
                  toggleFolder={toggleFolder}
                />
              </TreeElbowItem>
            ))}
          </fieldset>
        )}
      </li>
    );
  }
);
