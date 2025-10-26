import { useAtom } from 'jotai';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { Toggle } from '@/shared/ui/Toggle';

interface SidebarSettingsProps {
  dataTestId?: string;
}

export const SidebarSettings = ({ dataTestId }: SidebarSettingsProps) => {
  const [sidebarEnabled, setSidebarEnabled] = useAtom(sidebarEnabledAtom);

  return (
    <div className="space-y-4" data-testid={dataTestId}>
      <div className="text-sm text-fgColor-secondary">Show or hide the sidebar with your bookmark folders</div>

      <div className="flex items-center justify-between bg-bgColor-primary rounded-lg p-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-fgColor-primary mb-1">Enable Sidebar</div>
          <div className="text-xs text-fgColor-secondary">{sidebarEnabled ? 'Sidebar is visible' : 'Sidebar is hidden'}</div>
        </div>
        <Toggle checked={sidebarEnabled} data-testid="sidebar-settings-toggle" onChange={setSidebarEnabled} />
      </div>
    </div>
  );
};
