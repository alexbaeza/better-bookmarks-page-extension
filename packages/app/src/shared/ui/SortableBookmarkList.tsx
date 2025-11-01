import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { useDragDrop } from '@/app/providers/dragdrop-provider';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface SortableBookmarkListProps {
  items: IBookmarkItem[];
  folderId: string;
  renderItem: (item: IBookmarkItem, isDragging?: boolean) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SortableBookmarkList: React.FC<SortableBookmarkListProps> = ({ items, folderId: _folderId, renderItem, className = '', style }) => {
  const viewMode = useAtomValue(viewModeAtom);
  const { activeId } = useDragDrop();

  const strategy = viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy;

  return (
    <SortableContext items={items.map((item) => item.id)} strategy={strategy}>
      <div className={className} style={style}>
        {items.map((item) => (
          <div key={item.id}>{renderItem(item, item.id === activeId)}</div>
        ))}
      </div>
    </SortableContext>
  );
};
