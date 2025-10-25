import type React from 'react';

import { APP_VERSION } from '@/config/constants';
import { BuiltWith } from '@/shared/ui/BuiltWith';

export const SidebarFooter: React.FC = () => {
  return (
    <>
      <div className="mt-4 border-t border-bgColor-tertiary p-2 text-xs text-fgColor-secondary">
        <div className="mb-2">Version {APP_VERSION}</div>
        <BuiltWith className="justify-start" />
      </div>
    </>
  );
};
