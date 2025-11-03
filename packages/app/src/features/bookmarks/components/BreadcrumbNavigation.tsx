import { ChevronRight, Home } from 'lucide-react';
import type React from 'react';
import { Fragment } from 'react';

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

  const handleBreadcrumbClick = (pageId: string) => {
    navigateToPage(pageId);
  };

  // Truncate middle breadcrumbs if more than 5 items
  const getDisplayPath = () => {
    if (breadcrumbPath.length <= 5) {
      return { display: breadcrumbPath, showEllipsis: false };
    }
    // Show first 2, ellipsis, last 2
    return {
      display: [
        breadcrumbPath[0],
        breadcrumbPath[1],
        breadcrumbPath[breadcrumbPath.length - 2],
        breadcrumbPath[breadcrumbPath.length - 1],
      ],
      showEllipsis: true,
    };
  };

  const { display, showEllipsis } = getDisplayPath();

  const renderBreadcrumbItem = (item: { id: string; title: string }, index: number, originalIndex?: number) => (
    <Fragment key={item.id}>
      {index > 0 && <ChevronRight className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />}
      <button
        className="flex items-center space-x-2 hover:bg-bgColor-hover px-2 py-1 rounded transition-colors min-w-0"
        data-testid={`breadcrumb-item-${item.id}`}
        onClick={() => handleBreadcrumbClick(item.id)}
        type="button"
      >
        {originalIndex === 0 && <Home className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />}
        <Text
          className="truncate"
          color={originalIndex === breadcrumbPath.length - 1 ? 'primary' : 'secondary'}
          size="sm"
        >
          {item.title}
        </Text>
      </button>
    </Fragment>
  );

  return (
    <div className="flex items-center space-x-2">
      {canGoBack && (
        <IconButton
          dataTestId="breadcrumb-back"
          icon={<ChevronRight className="h-4 w-4 rotate-180" />}
          onClick={navigateBack}
        />
      )}

      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {showEllipsis ? (
          <>
            {renderBreadcrumbItem(display[0], 0, 0)}
            {renderBreadcrumbItem(display[1], 1, 1)}
            <ChevronRight className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />
            <Text className="px-2" color="secondary" size="sm">
              ...
            </Text>
            <ChevronRight className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />
            {renderBreadcrumbItem(display[2], 4, breadcrumbPath.length - 2)}
            {renderBreadcrumbItem(display[3], 5, breadcrumbPath.length - 1)}
          </>
        ) : (
          breadcrumbPath.map((item, index) => renderBreadcrumbItem(item, index, index))
        )}
      </div>
    </div>
  );
};
