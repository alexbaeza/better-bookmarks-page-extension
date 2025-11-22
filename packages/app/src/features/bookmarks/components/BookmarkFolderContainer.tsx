import type React from 'react';

export interface BookmarkFolderContainerProps {
  children: React.ReactNode;
  overflowVisible?: boolean;
  className?: string;
}

/**
 * Shared container component for bookmark folders.
 * Provides consistent styling for folder content areas.
 */
export const BookmarkFolderContainer: React.FC<BookmarkFolderContainerProps> = ({
  children,
  overflowVisible = false,
  className = '',
}) => {
  return (
    <div
      className={`min-h-64 w-full ${
        overflowVisible ? 'overflow-visible' : 'overflow-hidden'
      } rounded-lg border-4 border-bgColor-secondary/80 ${className}`}
    >
      {children}
    </div>
  );
};
