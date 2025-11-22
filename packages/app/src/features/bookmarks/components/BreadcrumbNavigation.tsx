import { ChevronRight, Home } from 'lucide-react';
import type React from 'react';
import { Fragment, useMemo } from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';
import { truncateWithEllipsis } from '@/shared/utils/array-utils';
import { buildBreadcrumbPath } from '@/shared/utils/breadcrumb-utils';

export const BreadcrumbNavigation: React.FC = () => {
  const { navigationStack, navigateToPage, navigateBack, canGoBack } = useBookmarkNavigation();
  const { rawFolders } = useBookmarks();

  const breadcrumbPath = useMemo(() => buildBreadcrumbPath(navigationStack, rawFolders), [navigationStack, rawFolders]);

  const handleBreadcrumbClick = (pageId: string) => {
    navigateToPage(pageId);
  };

  // Truncate middle breadcrumbs if more than 5 items
  const { display, showEllipsis } = useMemo(() => truncateWithEllipsis(breadcrumbPath, 5), [breadcrumbPath]);

  const renderBreadcrumbItem = (item: { id: string; title: string }, index: number, originalIndex?: number) => (
    <Fragment key={item.id}>
      {index > 0 && <ChevronRight className="h-4 w-4 text-fgColor-secondary flex-shrink-0" />}
      <button
        className="flex items-center space-x-2 hover:bg-bgColor-primary/30 px-2 py-1 rounded transition-colors min-w-0"
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
