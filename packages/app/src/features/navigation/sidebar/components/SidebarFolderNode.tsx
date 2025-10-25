import { useDroppable } from '@dnd-kit/core';
import { FolderDot as FolderDotIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon } from 'lucide-react';
import type React from 'react';
import { memo } from 'react';

import { DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
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
export const SidebarFolderNode: React.FC<FolderNodeProps> = memo(({ folder, level, expandedIds, toggleFolder, openFolderId, clickFolder }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${DROPPABLE_SIDEBAR_FOLDER_PREFIX}${folder.id}`,
    disabled: false,
  });

  if (!folder) {
    return null;
  }

  const isOpen = expandedIds.has(folder.id);
  const isSelected = openFolderId === folder.id;
  const hasKids = folder.children ? countFolders(folder) > 0 : false;

  return (
    <li
      ref={setNodeRef}
      role="treeitem"
      aria-level={level + 1}
      aria-selected={isSelected}
      {...(hasKids && { 'aria-expanded': isOpen })}
      className="relative outline-2 outline-offset-2 min-w-0"
    >
      {/* Folder Row */}
      <SidebarItem
        icon={hasKids ? (isOpen ? <FolderOpenIcon size={16} /> : <FolderIcon size={16} />) : <FolderDotIcon size={16} />}
        label={folder.title || 'Untitled'}
        badge={countItems(folder) + countFolders(folder)}
        isSelected={isSelected}
        onClick={() => {
          if (hasKids) toggleFolder(folder.id);
          clickFolder(folder.id);
        }}
        className={`cursor-pointer ${isOver ? 'ring-2 ring-offset-1 ring-fgColor-accent' : ''}`}
      />

      {/* Nested Children */}
      {isOpen && hasKids && folder.children && (
        <fieldset aria-label={`Subfolders of ${folder.title || 'Untitled'}`} className="relative ml-3 pl-1 overflow-visible min-w-0">
          {/* Vertical spine for this branch */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gray-600" />

          {folder.children.filter(onlyFolders).map((child: IBookmarkItem) => (
            <TreeElbowItem key={child.id}>
              <SidebarFolderNode
                folder={child}
                level={level + 1}
                expandedIds={expandedIds}
                toggleFolder={toggleFolder}
                openFolderId={openFolderId}
                clickFolder={clickFolder}
              />
            </TreeElbowItem>
          ))}
        </fieldset>
      )}
    </li>
  );
});
