import { useAtom } from 'jotai';

import { searchBarEnabledAtom } from '@/app/providers/atoms';
import { useTranslation } from '@/i18n/hooks';
import { SettingCard } from '@/shared/ui/SettingCard';
import { SettingItem } from '@/shared/ui/SettingItem';
import { Toggle } from '@/shared/ui/Toggle';

interface SearchBarSettingsProps {
  dataTestId?: string;
}

export const SearchBarSettings = ({ dataTestId = 'search-bar-settings' }: SearchBarSettingsProps) => {
  const { t } = useTranslation();
  const [searchBarEnabled, setSearchBarEnabled] = useAtom(searchBarEnabledAtom);

  return (
    <SettingItem dataTestId={dataTestId} description={t('settings.searchBar.description')}>
      <SettingCard
        description={searchBarEnabled ? t('settings.searchBar.visible') : t('settings.searchBar.hidden')}
        title={t('settings.searchBar.enableTitle')}
        toggle={
          <Toggle checked={searchBarEnabled} data-testid="search-bar-enabled-toggle" onChange={setSearchBarEnabled} />
        }
      />
    </SettingItem>
  );
};
