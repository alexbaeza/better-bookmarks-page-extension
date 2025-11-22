import { useAtom } from 'jotai';

import { sidebarEnabledAtom } from '@/app/providers/atoms';
import { useTranslation } from '@/i18n/hooks';
import { SettingCard } from '@/shared/ui/SettingCard';
import { SettingItem } from '@/shared/ui/SettingItem';
import { Toggle } from '@/shared/ui/Toggle';

interface SidebarSettingsProps {
  dataTestId?: string;
}

export const SidebarSettings = ({ dataTestId }: SidebarSettingsProps) => {
  const { t } = useTranslation();
  const [sidebarEnabled, setSidebarEnabled] = useAtom(sidebarEnabledAtom);

  return (
    <SettingItem dataTestId={dataTestId} description={t('settings.sidebar.description')}>
      <SettingCard
        description={sidebarEnabled ? t('settings.sidebar.visible') : t('settings.sidebar.hidden')}
        title={t('settings.sidebar.enableTitle')}
        toggle={<Toggle checked={sidebarEnabled} data-testid="sidebar-settings-toggle" onChange={setSidebarEnabled} />}
      />
    </SettingItem>
  );
};
