import type React from 'react';

export interface BookmarkItemMenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  dataTestId?: string;
}

export const BookmarkItemMenuItem: React.FC<BookmarkItemMenuItemProps> = ({
  icon,
  children,
  onClick,
  dataTestId = 'menu-item',
}) => {
  return (
    <button
      className="flex w-full items-center space-x-2 rounded-lg p-2 text-sm text-fgColor-primary hover:bg-bgColor-secondary"
      data-testid={dataTestId}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="flex-none">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </button>
  );
};
