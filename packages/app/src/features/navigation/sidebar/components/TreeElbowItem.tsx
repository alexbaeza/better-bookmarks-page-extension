import type React from 'react';

type TreeElbowItemProps = {
  children: React.ReactNode;
};

// Renders a div with a rounded elbow connector pointing to the row
export const TreeElbowItem: React.FC<TreeElbowItemProps> = ({ children }) => {
  return (
    <div className="relative ml-6 min-w-0 overflow-visible">
      <div className="pointer-events-none absolute -left-3 top-2 h-2 w-4 -translate-y-1/2 rounded-bl border-b border-l border-gray-600 z-10" />
      <div className="min-w-0">{children}</div>
    </div>
  );
};
