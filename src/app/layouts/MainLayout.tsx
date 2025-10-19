import { useAtomValue } from 'jotai';
import type React from 'react';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { Sidebar } from '@/features/navigation/sidebar/containers/Sidebar';

import { Header } from './Header';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const sidebarEnabled = useAtomValue(sidebarEnabledAtom);

  return (
    <div className="flex flex-1 overflow-hidden">
      {sidebarEnabled && <Sidebar />}
      <div className="flex-1 overflow-y-auto">
        <Header />
        <div className="flex-1 overflow-y-auto p-2" data-testid="content">
          {children}
        </div>
      </div>
    </div>
  );
};
