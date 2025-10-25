import type React from 'react';

type LeafProps = {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
};

export const SidebarLeaf: React.FC<LeafProps> = ({ id: _id, icon, label, badge, isSelected = false, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center justify-between space-x-2
        rounded-lg p-2 text-sm font-medium
        ${isSelected ? 'bg-fgColor-hover text-fgColor-primary' : 'text-fgColor-secondary hover:bg-fgColor-hover hover:text-fgColor-primary'}
        ${className}
      `}
    >
      <div className="flex flex-1 items-center space-x-2 truncate">
        <div className="flex-none">{icon}</div>
        <div className="truncate">{label}</div>
      </div>
      {badge != null && <span className="flex-none rounded-full bg-bgColor-tertiary px-2 text-xs text-fgColor-secondary">{badge}</span>}
    </button>
  );
};
