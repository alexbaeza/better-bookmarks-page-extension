import { memo } from 'react';
import { Bookmark } from '@/features/bookmarks/components/Bookmark';
import { useBaseBookmarkItem } from '@/features/bookmarks/components/items/BaseBookmarkItem';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkIcon } from '@/features/bookmarks/hooks/useBookmarkIcon';
import { useBookmarkModals } from '@/features/bookmarks/hooks/useBookmarkModals';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { Row } from '@/shared/ui/Row';

export interface BookmarkListItemProps {
  item: IBookmarkItem;
  dataTestId?: string;
  onFolderClick?: (item: IBookmarkItem) => void;
}

export const BookmarkListItem = memo<BookmarkListItemProps>(({ item, dataTestId, onFolderClick }) => {
  const { openEditModal } = useBookmarkModals();
  const { navigateToFolder } = useBookmarkNavigation();
  const { searchTerm } = useBookmarks();

  const handleEdit = (): void => {
    openEditModal(item);
  };

  const handleClick = (): void => {
    if (onFolderClick) {
      onFolderClick(item);
    } else if (item.children) {
      navigateToFolder(item.id);
    }
  };

  const highlightedTitle = highlighter(item.title, searchTerm);
  const isFolder = Boolean(item.children);
  const bookmarkIcon = useBookmarkIcon(item.url, 'sm');

  const {
    actions,
    dataTestId: testId,
    dragHandle,
    hovered,
    onMouseEnter,
    onMouseLeave,
    onClick,
  } = useBaseBookmarkItem(item, dataTestId, handleEdit, handleEdit, handleClick, onFolderClick, 16, 'list');

  return (
    <Bookmark.Root
      className="relative flex h-12 w-full overflow-visible rounded-lg bg-bgColor-tertiary transition hover:bg-fgColor-hover"
      dataTestId={testId}
      folderId={isFolder ? item.id : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Bookmark.Content
        className="flex h-full flex-1 items-center focus:outline-none min-w-0 overflow-hidden"
        dataTestId={item.url ? 'list-item-link' : 'list-item-button'}
        href={item.url}
        onClick={onClick}
      >
        <Row alignItems="center" className="h-full w-full" gap="none">
          <div className="flex-none shrink-0 pl-2">{dragHandle}</div>
          <div className="flex-none shrink-0 w-12">
            <Bookmark.Icon
              className={`flex h-full w-full items-center justify-center ${
                hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'
              }`}
              icon={bookmarkIcon}
            />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="px-2 py-1 flex flex-col justify-center h-full">
              <Bookmark.Title
                align="left"
                className="w-full"
                color={hovered ? 'primary' : 'secondary'}
                lineClamp={2}
                size="xs"
                title={highlightedTitle}
              />
            </div>
          </div>
        </Row>
      </Bookmark.Content>

      {actions && (
        <Bookmark.Actions className="absolute inset-y-0 right-0 z-20 flex h-full items-center space-x-1 rounded-r-lg p-1">
          {actions}
        </Bookmark.Actions>
      )}
    </Bookmark.Root>
  );
});
