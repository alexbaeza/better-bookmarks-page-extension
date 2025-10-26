import { Bookmark as BookmarkIcon, X as CloseIcon, Folder as FolderIcon } from 'lucide-react';
import type React from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import { countFolders, countItems, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';
import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';
// Removed FlyoutFolderNode in favor of direct SidebarItem usage
import { SidebarItem } from '@/features/navigation/sidebar/components/SidebarItem';
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
    <SidebarItem
      className="cursor-pointer"
      icon={<ImageWithFallback alt={leaf.title} className="size-6 rounded-sm border border-none" fallback={getDefaultFavicon()} src={faviconUrl} />}
      isSelected={currentPage === leaf.id}
      label={leaf.title || 'Untitled'}
      onClick={() => clickFolder(leaf.id)}
    />
  );
};

export const SidebarFlyout: React.FC<SidebarFlyoutProps> = ({ folder, onClose, clickFolder }) => {
  const { currentPage } = useBookmarkNavigation();

  return (
    <InlineFlyout widthClass="w-64">
      {/* Close button */}
      <div className="mb-2 flex justify-end">
        <button className="rounded p-1 text-fgColor-secondary hover:text-fgColor-primary" data-testid="flyout-close-button" onClick={onClose} type="button">
          <CloseIcon size={16} />
        </button>
      </div>

      {/* Folder title */}
      <h3 className="mb-2 text-lg font-semibold text-fgColor-primary" data-testid="flyout-title">
        {folder.title}
      </h3>

      <div className="flex-1 overflow-y-auto">
        {/* Nested Folders */}
        <SidebarSection icon={<FolderIcon size={14} />} title={`Folders (${countFolders(folder)})`}>
          {folder.children?.filter(onlyFolders).map((sub: IBookmarkItem) => (
            <li key={sub.id}>
              <SidebarItem
                badge={countFolders(sub) + countItems(sub)}
                className="cursor-pointer"
                icon={<FolderIcon size={16} />}
                isSelected={currentPage === sub.id}
                label={sub.title || 'Untitled'}
                onClick={() => clickFolder(sub.id)}
              />
            </li>
          ))}
        </SidebarSection>

        {/* Divider */}
        <div className="py-4">
          <hr className="border-t border-bgColor-tertiary pr-4" />
        </div>

        {/* Nested Items */}
        <SidebarSection icon={<BookmarkIcon size={14} />} title={`Items (${countItems(folder)})`}>
          {folder.children
            ?.filter((c: IBookmarkItem) => !Array.isArray(c.children))
            .map((leaf: IBookmarkItem) => (
              <BookmarkLeaf clickFolder={clickFolder} currentPage={currentPage} key={leaf.id} leaf={leaf} />
            ))}
        </SidebarSection>
      </div>
    </InlineFlyout>
  );
};
