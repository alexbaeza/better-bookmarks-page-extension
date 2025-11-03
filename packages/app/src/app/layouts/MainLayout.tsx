import { useAtomValue } from 'jotai';
import type React from 'react';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { SidebarFooter } from '@/features/navigation/sidebar/components/SidebarFooter';
import { Sidebar } from '@/features/navigation/sidebar/containers/Sidebar';

import { MainContent } from './MainContent';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const sidebarEnabled = useAtomValue(sidebarEnabledAtom);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {sidebarEnabled && <Sidebar footer={<SidebarFooter />} title="Better Bookmarks" />}
      <MainContent>{children}</MainContent>
    </div>
  );
};
