import { useDroppable } from '@dnd-kit/core';
import { FolderDot as FolderDotIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon } from 'lucide-react';
import type React from 'react';
import { memo } from 'react';

import { DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { countFolders, countItems, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { SidebarLeaf } from './SideBarLeaf';

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
      className="relative outline-2 outline-offset-2"
    >
      {/* Folder Row - unified with SidebarLeaf (icon inside) */}
      <SidebarLeaf
        id={folder.id}
        icon={hasKids ? isOpen ? <FolderOpenIcon size={16} /> : <FolderIcon size={16} /> : <FolderDotIcon size={16} />}
        label={folder.title || 'Untitled'}
        badge={countItems(folder) + countFolders(folder)}
        isSelected={isSelected}
        onClick={() => {
          // Toggle tree and open flyout
          if (hasKids) toggleFolder(folder.id);
          clickFolder(folder.id);
        }}
        className={`cursor-pointer ${isOver ? 'ring-2 ring-offset-1 ring-fgColor-accent' : ''}`}
      />

      {/* Nested Children */}
      {isOpen && hasKids && folder.children && (
        <fieldset aria-label={`Subfolders of ${folder.title || 'Untitled'}`} className="relative ml-3">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 w-px bg-gray-600" style={{ left: '0px' }} />

          {folder.children.filter(onlyFolders).map((child: IBookmarkItem) => (
            <li key={child.id} className="relative ml-4">
              {/* Horizontal Connector */}
              <div
                className="absolute h-px bg-gray-600"
                style={{
                  left: '-16px',
                  width: '16px',
                  top: '16px',
                }}
              />
              <SidebarFolderNode
                folder={child}
                level={level + 1}
                expandedIds={expandedIds}
                toggleFolder={toggleFolder}
                openFolderId={openFolderId}
                clickFolder={clickFolder}
              />
            </li>
          ))}
        </fieldset>
      )}
    </li>
  );
});
