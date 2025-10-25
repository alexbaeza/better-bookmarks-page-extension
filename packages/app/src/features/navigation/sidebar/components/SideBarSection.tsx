import type React from 'react';

type SectionProps = {
  title: string;
  icon?: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
};
export const SidebarSection: React.FC<SectionProps> = ({ title, icon, badge, children }) => (
  <>
    <h4 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-fgColor-secondary min-w-0">
      <div className="flex-1 min-w-0 truncate text-left">{title}</div>
      {icon && <span className="flex-none text-fgColor-secondary hover:text-fgColor-primary">{icon}</span>}
      {badge !== undefined && (
        <span className="flex-none rounded-full bg-bgColor-tertiary px-2 py-0.5 text-xs text-fgColor-secondary min-w-[1.5rem] text-center">{badge}</span>
      )}
    </h4>
    <ul className="space-y-1 min-w-0">{children}</ul>
  </>
);
