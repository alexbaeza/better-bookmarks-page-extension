import { Bookmark as BookmarkIcon, X as CloseIcon, Folder as FolderIcon } from 'lucide-react';
import type React from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import { countFolders, countItems, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';
import { FlyoutFolderNode } from '@/features/navigation/sidebar/components/FlyOutFolderNode';
import { SidebarLeaf } from '@/features/navigation/sidebar/components/SideBarLeaf';
import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { InlineFlyout } from '@/shared/ui/Flyout';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

interface SidebarFlyoutProps {
  folder: IBookmarkItem;
  onClose: () => void;
  clickFolder: (id: string) => void;
}

const BookmarkLeaf: React.FC<{
  leaf: IBookmarkItem;
  currentPage: string;
  clickFolder: (id: string) => void;
}> = ({ leaf, currentPage, clickFolder }) => {
  const faviconUrl = useFavicon(leaf.url || '');

  return (
    <SidebarLeaf
      key={leaf.id}
      id={leaf.id}
      icon={<ImageWithFallback className="size-6 rounded-sm border border-none" src={faviconUrl} fallback={getDefaultFavicon()} alt={leaf.title} />}
      label={leaf.title || 'Untitled'}
      isSelected={currentPage === leaf.id}
      onClick={() => clickFolder(leaf.id)}
      className="cursor-pointer"
    />
  );
};

export const SidebarFlyout: React.FC<SidebarFlyoutProps> = ({ folder, onClose, clickFolder }) => {
  const { currentPage } = useBookmarkNavigation();

  return (
    <InlineFlyout widthClass="w-64">
      {/* Close button */}
      <div className="mb-2 flex justify-end">
        <button type="button" onClick={onClose} className="rounded p-1 text-fgColor-secondary hover:text-fgColor-primary">
          <CloseIcon size={16} />
        </button>
      </div>

      {/* Folder title */}
      <h3 className="mb-2 text-lg font-semibold text-fgColor-primary">{folder.title}</h3>

      <div className="flex-1 overflow-y-auto">
        {/* Nested Folders */}
        <SidebarSection title={`Folders (${countFolders(folder)})`} icon={<FolderIcon size={14} />}>
          {folder.children?.filter(onlyFolders).map((sub: IBookmarkItem) => (
            <FlyoutFolderNode key={sub.id} folder={sub} isSelected={currentPage === sub.id} clickFolder={clickFolder} />
          ))}
        </SidebarSection>

        {/* Divider */}
        <div className="py-4">
          <hr className="border-t border-bgColor-tertiary pr-4" />
        </div>

        {/* Nested Items */}
        <SidebarSection title={`Items (${countItems(folder)})`} icon={<BookmarkIcon size={14} />}>
          {folder.children
            ?.filter((c: IBookmarkItem) => !Array.isArray(c.children))
            .map((leaf: IBookmarkItem) => (
              <BookmarkLeaf key={leaf.id} leaf={leaf} currentPage={currentPage} clickFolder={clickFolder} />
            ))}
        </SidebarSection>
      </div>
    </InlineFlyout>
  );
};
