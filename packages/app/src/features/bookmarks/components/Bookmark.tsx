import type React from 'react';

import { Text } from '@/shared/ui/Text';
import { BookmarkDragHandle } from './items/BookmarkDragHandle';

const BookmarkRoot: React.FC<{
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  folderId?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  externalRef?: React.RefCallback<HTMLElement>;
}> = ({ children, className = '', dataTestId, onMouseEnter, onMouseLeave, externalRef }) => {
  return (
    <div
      className={className || undefined}
      data-testid={dataTestId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={externalRef}
      role="group"
    >
      {children}
    </div>
  );
};

const BookmarkContent: React.FC<{
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  href?: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}> = ({ children, className = '', dataTestId, href, onClick, onKeyDown }) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      className={`focus:outline-none ${className}`.trim()}
      data-testid={dataTestId}
      href={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={Component === 'button' ? 0 : undefined}
    >
      {children}
    </Component>
  );
};

const BookmarkActions: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div
      aria-label="Item actions"
      className={className}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="toolbar"
    >
      {children}
    </div>
  );
};

const BookmarkIcon: React.FC<{ icon: React.ReactNode; className?: string; dataTestId?: string }> = ({
  icon,
  className = '',
  dataTestId,
}) => {
  return (
    <div className={className} data-testid={dataTestId}>
      {icon}
    </div>
  );
};

const BookmarkTitle: React.FC<{
  title: React.ReactNode;
  align?: 'left' | 'center';
  color?: 'primary' | 'secondary';
  lineClamp?: 1 | 2 | 3;
  size?: 'xs' | 'sm' | 'base';
  className?: string;
}> = ({ title, align = 'center', color = 'primary', lineClamp = 2, size = 'xs', className = '' }) => {
  return (
    <Text align={align} as="p" className={className} color={color} lineClamp={lineClamp} size={size} truncate>
      {title}
    </Text>
  );
};

const BookmarkDragHandleWrapper: React.FC<{
  hovered?: boolean;
  size?: number;
  variant?: 'grid' | 'list';
  className?: string;
}> = ({ hovered = false, size = 16, variant = 'grid', className = '' }) => {
  return <BookmarkDragHandle className={className} hovered={hovered} size={size} variant={variant} />;
};

interface BookmarkComponent extends React.FC<{ children: React.ReactNode }> {
  Root: typeof BookmarkRoot;
  Content: typeof BookmarkContent;
  Actions: typeof BookmarkActions;
  Icon: typeof BookmarkIcon;
  Title: typeof BookmarkTitle;
  DragHandle: typeof BookmarkDragHandleWrapper;
}

const Bookmark: BookmarkComponent = ({ children }) => <>{children}</>;

Bookmark.Root = BookmarkRoot;
Bookmark.Content = BookmarkContent;
Bookmark.Actions = BookmarkActions;
Bookmark.Icon = BookmarkIcon;
Bookmark.Title = BookmarkTitle;
Bookmark.DragHandle = BookmarkDragHandleWrapper;

export { Bookmark };
