import { useDroppable } from '@dnd-kit/core';
import { FolderDot as FolderDotIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon } from 'lucide-react';
import type React from 'react';
import { memo, useMemo } from 'react';

import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { countFolders, countItems, findParentOfItem, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
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
  const { activeId } = useDragDrop();
  const { rawFolders } = useBookmarks();

  // Disable droppable if the dragged item is from the same folder
  const isDisabled = useMemo(() => {
    if (!activeId) return false;
    const srcParent = findParentOfItem(rawFolders, activeId);
    const fromFolderId = srcParent?.id || 'root';
    return folder.id === fromFolderId;
  }, [activeId, folder.id, rawFolders]);

  const { setNodeRef, isOver } = useDroppable({
    disabled: isDisabled,
    id: `${DROPPABLE_SIDEBAR_FOLDER_PREFIX}${folder.id}`,
  });

  if (!folder) {
    return null;
  }

  const isOpen = expandedIds.has(folder.id);
  const isSelected = openFolderId === folder.id;
  const hasKids = folder.children ? countFolders(folder) > 0 : false;

  return (
    <li
      aria-level={level + 1}
      aria-selected={isSelected}
      ref={setNodeRef}
      role="treeitem"
      {...(hasKids && { 'aria-expanded': isOpen })}
      className="relative min-w-0"
      tabIndex={0}
    >
      {/* Folder Row */}
      <SidebarItem
        badge={countItems(folder) + countFolders(folder)}
        className={`cursor-pointer ${isOver && !isDisabled ? 'ring-2 ring-fgColor-accent' : ''} ${isDisabled ? 'opacity-50' : ''}`}
        data-testid={`sidebar-folder-item-${folder.id}`}
        icon={hasKids ? isOpen ? <FolderOpenIcon size={16} /> : <FolderIcon size={16} /> : <FolderDotIcon size={16} />}
        isSelected={isSelected}
        label={folder.title || 'Untitled'}
        onClick={() => {
          if (hasKids) toggleFolder(folder.id);
          clickFolder(folder.id);
        }}
      />

      {/* Nested Children */}
      {isOpen && hasKids && folder.children && (
        <fieldset aria-label={`Subfolders of ${folder.title || 'Untitled'}`} className="relative ml-0 pl-0 overflow-visible min-w-0">
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
});
