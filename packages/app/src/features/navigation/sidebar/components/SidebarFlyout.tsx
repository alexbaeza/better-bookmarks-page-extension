import { Bookmark as BookmarkIcon, X as CloseIcon, Folder as FolderIcon } from 'lucide-react';
import type React from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import { countFolders, countItems, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';
import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';
import { SidebarItem } from '@/features/navigation/sidebar/components/SidebarItem';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { InlineFlyout } from '@/shared/ui/Flyout';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { Text } from '@/shared/ui/Text';
import { isBookmarkFolder } from '@/shared/utils/bookmark-utils';

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
      data-testid={`flyout-bookmark-${leaf.id}`}
      icon={
        <ImageWithFallback
          alt={leaf.title}
          className="size-6 rounded-sm border border-none"
          fallback={getDefaultFavicon()}
          isFavicon={true}
          src={faviconUrl}
        />
      }
      isSelected={currentPage === leaf.id}
      label={leaf.title || 'Untitled'}
      onClick={() => clickFolder(leaf.id)}
    />
  );
};

const FlyoutFolderItem: React.FC<{
  folder: IBookmarkItem;
  currentPage: string;
  clickFolder: (id: string) => void;
}> = ({ folder, currentPage, clickFolder }) => {
  return (
    <li className="mb-1">
      <div>
        <SidebarItem
          badge={countFolders(folder) + countItems(folder)}
          className="cursor-pointer"
          data-testid={`flyout-folder-${folder.id}`}
          icon={<FolderIcon size={16} />}
          isSelected={currentPage === folder.id}
          label={folder.title || 'Untitled'}
          onClick={() => clickFolder(folder.id)}
        />
      </div>
    </li>
  );
};

export const SidebarFlyout: React.FC<SidebarFlyoutProps> = ({ folder, onClose, clickFolder }) => {
  const { currentPage } = useBookmarkNavigation();

  return (
    <div>
      <InlineFlyout data-testid="sidebar-flyout" widthClass="w-64 h-full">
        {/* Close button */}
        <div className="mb-1 flex justify-end">
          <button
            className="rounded px-1 py-0.5 text-fgColor-secondary hover:text-fgColor-primary"
            data-testid="flyout-close-button"
            onClick={onClose}
            type="button"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Folder title */}
        <Text as="h3" className="mb-1" color="primary" data-testid="flyout-title" size="lg" weight="semibold">
          {folder.title}
        </Text>

        <div className="flex-1 overflow-y-auto px-1">
          {/* Nested Folders */}
          <SidebarSection icon={<FolderIcon size={14} />} title={`Folders (${countFolders(folder)})`}>
            {folder.children?.filter(onlyFolders).map((sub: IBookmarkItem) => (
              <FlyoutFolderItem clickFolder={clickFolder} currentPage={currentPage} folder={sub} key={sub.id} />
            ))}
          </SidebarSection>

          {/* Divider */}
          <div className="py-3">
            <hr className="border-t border-bgColor-secondary/30" />
          </div>

          {/* Nested Items */}
          <SidebarSection icon={<BookmarkIcon size={14} />} title={`Items (${countItems(folder)})`}>
            {folder.children
              ?.filter((child: IBookmarkItem) => !isBookmarkFolder(child))
              .map((leaf: IBookmarkItem) => (
                <div className="mb-1" key={leaf.id}>
                  <BookmarkLeaf clickFolder={clickFolder} currentPage={currentPage} leaf={leaf} />
                </div>
              ))}
          </SidebarSection>
        </div>
      </InlineFlyout>
    </div>
  );
};
