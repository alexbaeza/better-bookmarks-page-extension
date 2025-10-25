import { Folder as FolderIcon } from 'lucide-react';
import type React from 'react';

import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { countFolders, countItems } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { SidebarLeaf } from './SideBarLeaf';

type FlyoutFolderNodeProps = {
  folder: IBookmarkItem;
  isSelected: boolean;
  clickFolder: (id: string) => void;
};

export const FlyoutFolderNode: React.FC<FlyoutFolderNodeProps> = ({ folder, isSelected, clickFolder }) => {
  return (
    <li>
      <SidebarLeaf
        id={folder.id}
        icon={<FolderIcon size={16} />}
        label={folder.title || 'Untitled'}
        badge={countFolders(folder) + countItems(folder)}
        isSelected={isSelected}
        onClick={() => clickFolder(folder.id)}
        className="cursor-pointer"
      />
    </li>
  );
};
