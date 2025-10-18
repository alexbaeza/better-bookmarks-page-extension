import { Bookmark as BookmarkIcon } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { SidebarLeaf } from '@/features/navigation/sidebar/components/SideBarLeaf';
import { SidebarSection } from '@/features/navigation/sidebar/components/SideBarSection';
import { SidebarFlyout } from '@/features/navigation/sidebar/components/SidebarFlyout';
import { SidebarFolderNode } from '@/features/navigation/sidebar/components/SidebarFolderNode';
import { findFolderById, onlyFolders } from '@/features/navigation/sidebar/utils/sidebar.utils';
import '../components/tree.css';
import { AppFooter } from '@/shared/ui/AppFooter';

import pkg from '../../../../../package.json';

export const Sidebar: React.FC = () => {
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
          <h2 className="mb-4 flex items-center text-lg font-bold text-fgColor-primary">Better Bookmarks</h2>
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
      <nav className="w-64 shrink-0 bg-bgColor-secondary p-4 flex h-full flex-col" aria-label="Bookmarks navigation">
        <h2 className="mb-4 flex items-center text-lg font-bold text-fgColor-primary">Better Bookmarks</h2>
        <div className="flex-1 overflow-y-auto px-2" role="tree" aria-label="Bookmark folders">
          {/* Pages */}
          <SidebarSection title="Pages">
            <SidebarLeaf
              id="all"
              icon={<BookmarkIcon size={16} />}
              label="All Items"
              badge={counts.all}
              isSelected={isAll}
              onClick={handleClickAll}
              className="cursor-pointer"
            />
            <SidebarLeaf
              id="uncategorized"
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
            <div className="space-y-1">
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
        <div className="mt-4 border-t border-bgColor-tertiary pt-3 text-xs text-fgColor-secondary">
          <div className="mb-2">Version {pkg.version}</div>
          <AppFooter className="justify-start" />
        </div>
      </nav>

      {openFolderId && selectedFolder && <SidebarFlyout folder={selectedFolder} onClose={() => setOpenFolderId(null)} clickFolder={clickFolder} />}
    </div>
  );
};
