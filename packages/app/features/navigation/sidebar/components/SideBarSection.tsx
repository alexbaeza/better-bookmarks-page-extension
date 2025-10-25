import type React from 'react';

type SectionProps = {
  title: string;
  icon?: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
};
export const SidebarSection: React.FC<SectionProps> = ({ title, icon, badge, children }) => (
  <>
    <h4 className="mb-1 flex items-center justify-between text-xs font-semibold uppercase text-fgColor-secondary">
      <div className="inline-flex items-center space-x-1">
        <span>{title}</span>
      </div>
      {icon && <span className="text-fgColor-secondary hover:text-fgColor-primary">{icon}</span>}
      {badge !== undefined && <span className="bg-bgColor-hover flex-none rounded-full bg-bgColor-tertiary px-2 text-xs text-fgColor-secondary ">{badge}</span>}
    </h4>
    <ul className="space-y-1">{children}</ul>
  </>
);
