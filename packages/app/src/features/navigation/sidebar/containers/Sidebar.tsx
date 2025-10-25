import { Bookmark as BookmarkIcon } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findFolderById, onlyFolders } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';
import { SidebarFlyout } from '@/features/navigation/sidebar/components/SidebarFlyout';
import { SidebarFolderNode } from '@/features/navigation/sidebar/components/SidebarFolderNode';
import { SidebarItem } from '@/features/navigation/sidebar/components/SidebarItem';

export interface SidebarProps {
  title?: string;
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ title = 'Better Bookmarks', footer }) => {
  const { counts, rawFolders, isLoading } = useBookmarks();
  const { currentPage, setCurrentPage } = useBookmarkNavigation();

  const isAll = currentPage === 'All';
  const isUncat = currentPage === 'Uncategorized';

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (isAll || isUncat) {
      setOpenFolderId(null);
    }
  }, [isAll, isUncat]);

  const roots = useMemo(() => rawFolders.filter(onlyFolders), [rawFolders]);

  const toggleFolder = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleClickAll = useCallback(() => setCurrentPage('All'), [setCurrentPage]);
  const handleClickUncategorized = useCallback(() => setCurrentPage('Uncategorized'), [setCurrentPage]);

  const clickFolder = useCallback(
    (id: string) => {
      setOpenFolderId(id);
      setCurrentPage(id);
    },
    [setCurrentPage]
  );

  const selectedFolder = useMemo(() => findFolderById(rawFolders, openFolderId), [rawFolders, openFolderId]);

  if (isLoading) {
    return (
      <div className="flex h-screen" data-testid="sidebar">
        <nav className="w-64 shrink-0 bg-bgColor-secondary p-4" aria-label="Bookmarks navigation">
          <h2 className="mb-4 flex items-center text-lg font-bold text-fgColor-primary">{title}</h2>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto px-2">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-bgColor-tertiary rounded" />
              <div className="h-4 bg-bgColor-tertiary rounded" />
              <div className="h-4 bg-bgColor-tertiary rounded" />
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex h-screen" data-testid="sidebar">
      {/* Main tree */}
      <nav className="w-64 min-w-64 max-w-64 shrink-0 bg-bgColor-secondary flex h-full flex-col overflow-hidden" aria-label="Bookmarks navigation">
        <h2 className="p-2 mb-4 flex items-center text-lg font-bold text-fgColor-primary">{title}</h2>
        <div className="flex-1 overflow-y-auto px-2 min-w-0" role="tree" aria-label="Bookmark folders">
          {/* Pages */}
          <SidebarSection title="Pages">
            <SidebarItem
              icon={<BookmarkIcon size={16} />}
              label="All Items"
              badge={counts.all}
              isSelected={isAll}
              onClick={handleClickAll}
              className="cursor-pointer"
            />
            <SidebarItem
              icon={<BookmarkIcon size={16} />}
              label="Uncategorized"
              badge={counts.uncategorized}
              isSelected={isUncat}
              onClick={handleClickUncategorized}
              className="cursor-pointer"
            />
          </SidebarSection>

          <div className="border-t border-bgColor-tertiary py-6" />

          {/* Folder roots */}
          <SidebarSection title="Folders">
            <div className="space-y-1 min-w-0 overflow-hidden">
              {roots.map((f) => (
                <SidebarFolderNode
                  key={f.id}
                  folder={f}
                  level={0}
                  expandedIds={expandedIds}
                  toggleFolder={toggleFolder}
                  openFolderId={openFolderId}
                  clickFolder={clickFolder}
                />
              ))}
            </div>
          </SidebarSection>
        </div>
        {footer && footer}
      </nav>

      {openFolderId && selectedFolder && <SidebarFlyout folder={selectedFolder} onClose={() => setOpenFolderId(null)} clickFolder={clickFolder} />}
    </div>
  );
};
