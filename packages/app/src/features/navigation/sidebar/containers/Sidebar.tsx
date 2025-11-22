import { Bookmark as BookmarkIcon } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { type PageId, useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { buildPathToFolder, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';
import { SidebarFolderNode } from '@/features/navigation/sidebar/components/SidebarFolderNode';
import { SidebarItem } from '@/features/navigation/sidebar/components/SidebarItem';
import { Text } from '@/shared/ui/Text';
import { isAllPage, isRootPage, isUncategorizedPage } from '@/shared/utils/page-utils';

export interface SidebarProps {
  title?: string;
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ title = 'Better Bookmarks', footer }) => {
  const { counts, rawFolders, isLoading } = useBookmarks();
  const { currentPage, navigateToPage, navigateToFolderWithPath } = useBookmarkNavigation();

  const isRoot = isRootPage(currentPage);
  const isAll = isAllPage(currentPage);
  const isUncat = isUncategorizedPage(currentPage);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (isRoot) {
      setOpenFolderId(null);
    }
  }, [isRoot]);

  const roots = useMemo(() => rawFolders.filter(onlyFolders), [rawFolders]);

  const toggleFolder = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleClickAll = useCallback(() => navigateToPage('All'), [navigateToPage]);
  const handleClickUncategorized = useCallback(() => navigateToPage('Uncategorized'), [navigateToPage]);

  const clickFolder = useCallback(
    (id: string) => {
      setOpenFolderId(id);
      const path = buildPathToFolder(rawFolders, id);
      const fullPath: PageId[] = ['All', ...path];
      navigateToFolderWithPath(id, fullPath);
    },
    [navigateToFolderWithPath, rawFolders]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen" data-testid="sidebar">
        <nav aria-label="Bookmarks navigation" className="w-64 shrink-0 bg-bgColor-secondary p-4">
          <Text as="h2" className="mb-4 flex items-center" color="primary" size="lg" weight="bold">
            {title}
          </Text>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto px-2">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-bgColor-secondary/50 rounded" />
              <div className="h-4 bg-bgColor-secondary/50 rounded" />
              <div className="h-4 bg-bgColor-secondary/50 rounded" />
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen" data-testid="sidebar">
      <nav
        aria-label="Bookmarks navigation"
        className="w-64 min-w-64 max-w-64 shrink-0 bg-bgColor-secondary flex h-full max-h-full flex-col pr-2"
      >
        <Text as="h2" className="p-2 mb-4 shrink-0" color="primary" size="lg" weight="bold">
          {title}
        </Text>
        <div
          aria-label="Bookmark folders"
          className="flex-1 min-h-0 overflow-y-auto overflow-x-visible px-1"
          role="tree"
        >
          <SidebarSection title="Pages">
            <SidebarItem
              badge={counts.all}
              className="cursor-pointer"
              icon={<BookmarkIcon size={16} />}
              isSelected={isAll}
              label="All Items"
              onClick={handleClickAll}
            />
            <SidebarItem
              badge={counts.uncategorized}
              className="cursor-pointer"
              icon={<BookmarkIcon size={16} />}
              isSelected={isUncat}
              label="Uncategorized"
              onClick={handleClickUncategorized}
            />
          </SidebarSection>

          <div className="border-t border-bgColor-secondary/30 py-6" />

          <SidebarSection title="Folders">
            {roots.map((folder) => (
              <SidebarFolderNode
                clickFolder={clickFolder}
                expandedIds={expandedIds}
                folder={folder}
                key={folder.id}
                level={0}
                openFolderId={openFolderId}
                toggleFolder={toggleFolder}
              />
            ))}
          </SidebarSection>
        </div>
        {footer && <div className="shrink-0 mt-auto">{footer}</div>}
      </nav>
    </div>
  );
};
