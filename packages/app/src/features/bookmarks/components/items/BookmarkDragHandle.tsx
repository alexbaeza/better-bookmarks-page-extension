import { GripVertical } from 'lucide-react';
import type React from 'react';

import { useTranslation } from '@/i18n/hooks';

export interface BookmarkDragHandleProps {
  hovered?: boolean;
  size?: number;
  className?: string;
  variant?: 'grid' | 'list';
}

export const BookmarkDragHandle: React.FC<BookmarkDragHandleProps> = ({
  hovered = false,
  size = 16,
  className = '',
  variant = 'grid',
}) => {
  const { t } = useTranslation();
  const handleElement = (
    <div
      aria-label={t('bookmarks.dragHandle')}
      className={`cursor-grab flex items-center justify-center focus:outline-none ${hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'} ${className}`}
      data-testid="drag-handle-button"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <GripVertical size={size} />
    </div>
  );

  // List variant wraps in a styled container
  if (variant === 'list') {
    return (
      <div className="bg-bgColor-secondary-contrast flex h-full w-full items-center justify-center rounded-l-lg">
        {handleElement}
      </div>
    );
  }

  return handleElement;
};
