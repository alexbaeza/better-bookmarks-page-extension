import { FolderIcon } from 'lucide-react';
import type React from 'react';

interface BookmarkFolderGridItemProps {
  title: string;
  onClick: () => void;
  dataTestId?: string;
}

export const BookmarkFolderGridItem: React.FC<BookmarkFolderGridItemProps> = ({ title, onClick, dataTestId = 'bookmark-folder-grid-item' }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      data-testid={dataTestId}
      className="cursor-pointer p-4 hover:bg-gray-100 rounded-lg border border-gray-200"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      type="button"
    >
      <div className="flex flex-col items-center space-y-2">
        <FolderIcon data-testid="folder-icon" size={24} className="text-blue-500" />
        <span className="text-sm text-gray-700 text-center">{title}</span>
      </div>
    </button>
  );
};
