import { useAtom } from 'jotai';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { SettingCard } from '@/shared/ui/SettingCard';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
import { Toggle } from '@/shared/ui/Toggle';

interface SidebarSettingsProps {
  dataTestId?: string;
}

export const SidebarSettings = ({ dataTestId }: SidebarSettingsProps) => {
  const [sidebarEnabled, setSidebarEnabled] = useAtom(sidebarEnabledAtom);

  return (
    <Stack data-testid={dataTestId} gap="lg">
      <Text color="secondary" size="sm">
        Show or hide the sidebar with your bookmark folders
      </Text>

      <SettingCard
        description={sidebarEnabled ? 'Sidebar is visible' : 'Sidebar is hidden'}
        title="Enable Sidebar"
        toggle={<Toggle checked={sidebarEnabled} data-testid="sidebar-settings-toggle" onChange={setSidebarEnabled} />}
      />
    </Stack>
  );
};
