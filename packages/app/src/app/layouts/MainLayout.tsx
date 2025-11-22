import { useAtomValue } from 'jotai';
import type React from 'react';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { SidebarFooter } from '@/features/navigation/sidebar/components/SidebarFooter';
import { Sidebar } from '@/features/navigation/sidebar/containers/Sidebar';
import { useTranslation } from '@/i18n/hooks';

import { MainContent } from './MainContent';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const sidebarEnabled = useAtomValue(sidebarEnabledAtom);

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {sidebarEnabled && <Sidebar footer={<SidebarFooter />} title={t('app.title')} />}
      <MainContent>{children}</MainContent>
    </div>
  );
};
