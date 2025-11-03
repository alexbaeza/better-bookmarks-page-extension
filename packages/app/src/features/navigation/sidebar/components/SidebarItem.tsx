import type React from 'react';

import { Badge } from '@/shared/ui/Badge';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
  'data-testid'?: string;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  badge,
  isSelected = false,
  onClick,
  className = '',
  'data-testid': dataTestId,
}) => {
  return (
    <button
      className={`
        grid w-full grid-cols-[auto,1fr,auto] items-center gap-2 min-w-0
        rounded-lg p-2 text-sm font-medium focus:outline-none
        ${isSelected ? 'bg-bgColor-tertiary text-fgColor-primary' : 'text-fgColor-secondary hover:bg-bgColor-tertiary hover:text-fgColor-primary'}
        ${className}
      `}
      data-testid={dataTestId}
      onClick={onClick}
      type="button"
    >
      <div className="col-[1]">{icon}</div>
      <div className="col-[2] min-w-0 truncate text-left">{label}</div>
      {badge != null && (
        <div className="col-[3]">
          <Badge size="sm">{badge}</Badge>
        </div>
      )}
    </button>
  );
};
