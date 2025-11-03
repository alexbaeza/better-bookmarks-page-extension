import { memo } from 'react';
import { Bookmark } from '@/features/bookmarks/components/Bookmark';
import { useBaseBookmarkItem } from '@/features/bookmarks/components/items/BaseBookmarkItem';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkIcon } from '@/features/bookmarks/hooks/useBookmarkIcon';
import { useBookmarkModals } from '@/features/bookmarks/hooks/useBookmarkModals';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BookmarkGridItemProps {
  item: IBookmarkItem;
  dataTestId?: string;
  onFolderClick?: (item: IBookmarkItem) => void;
}

export const BookmarkGridItem = memo<BookmarkGridItemProps>(({ item, dataTestId, onFolderClick }) => {
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
  const bookmarkIcon = useBookmarkIcon(item.url, 'md');

  const {
    actions,
    dataTestId: testId,
    dragHandle,
    hovered,
    onMouseEnter,
    onMouseLeave,
    onClick,
  } = useBaseBookmarkItem(item, dataTestId, handleEdit, handleEdit, handleClick, onFolderClick, 12, 'grid');

  return (
    <Bookmark.Root
      className={`relative flex w-30 flex-col items-center gap-1 rounded-lg p-2 transition ${hovered ? 'bg-bgColor-tertiary' : 'bg-bgColor-secondary'}`}
      dataTestId={testId}
      folderId={isFolder ? item.id : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative z-10 flex w-full flex-end justify-between" role="none">
        {dragHandle}
        {actions && <Bookmark.Actions className="relative z-10 flex items-center">{actions}</Bookmark.Actions>}
      </div>

      <Bookmark.Content
        className="relative z-0 -mt-4 flex flex-col items-center cursor-pointer flex-1 w-full pointer-events-auto"
        dataTestId="grid-item-main-button"
        href={item.url}
        onClick={onClick}
      >
        <Bookmark.Icon
          className="bg-bgColor-tertiary-contrast flex size-14 items-center justify-center rounded-lg"
          dataTestId="favicon"
          icon={bookmarkIcon}
        />
        <Bookmark.Title
          align="center"
          className="h-8 w-full max-w-full overflow-hidden"
          lineClamp={2}
          size="xs"
          title={highlightedTitle}
        />
      </Bookmark.Content>
    </Bookmark.Root>
  );
});
