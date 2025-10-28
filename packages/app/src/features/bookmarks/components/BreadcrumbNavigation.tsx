import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findItemById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';

export const BreadcrumbNavigation: React.FC = () => {
  const { navigationStack, navigateToPage, navigateBack, canGoBack } = useBookmarkNavigation();
  const { rawFolders } = useBookmarks();

  const buildBreadcrumbPath = () => {
    const path: Array<{ id: string; title: string }> = [];

    for (const pageId of navigationStack) {
      if (pageId === 'All') {
        path.push({ id: 'All', title: 'All Bookmarks' });
      } else if (pageId === 'Uncategorized') {
        path.push({ id: 'Uncategorized', title: 'Uncategorized' });
      } else {
        const folder = findItemById(rawFolders, pageId);
        if (folder) {
          path.push({ id: folder.id, title: folder.title || 'Untitled' });
        }
      }
    }

    return path;
  };

  const breadcrumbPath = buildBreadcrumbPath();

  const handleBreadcrumbClick = (pageId: string, _index: number) => {
    navigateToPage(pageId);
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 border-b border-bgColor-tertiary">
      {canGoBack && <IconButton dataTestId="breadcrumb-back" icon={<ChevronRight className="h-4 w-4 rotate-180" />} onClick={navigateBack} />}

      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {breadcrumbPath.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />}
            <button
              className="flex items-center space-x-2 hover:bg-bgColor-hover px-2 py-1 rounded transition-colors min-w-0"
              data-testid={`breadcrumb-item-${item.id}`}
              onClick={() => handleBreadcrumbClick(item.id, index)}
              type="button"
            >
              {index === 0 && <Home className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />}
              <Text className="truncate" color={index === breadcrumbPath.length - 1 ? 'primary' : 'secondary'} size="sm">
                {item.title}
              </Text>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
