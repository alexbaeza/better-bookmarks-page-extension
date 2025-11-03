import { useAtom } from 'jotai';

import { searchBarEnabledAtom } from '@/app/providers/atoms';
import { SettingCard } from '@/shared/ui/SettingCard';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
import { Toggle } from '@/shared/ui/Toggle';

interface SearchBarSettingsProps {
  dataTestId?: string;
}

export const SearchBarSettings = ({ dataTestId = 'search-bar-settings' }: SearchBarSettingsProps) => {
  const [searchBarEnabled, setSearchBarEnabled] = useAtom(searchBarEnabledAtom);

  return (
    <Stack data-testid={dataTestId} gap="lg">
      <Text color="secondary" size="sm">
        Control the visibility of the search functionality
      </Text>

      <SettingCard
        description={searchBarEnabled ? 'Search bar will be shown' : 'Search bar is hidden'}
        title="Enable Search Bar"
        toggle={
          <Toggle checked={searchBarEnabled} data-testid="search-bar-enabled-toggle" onChange={setSearchBarEnabled} />
        }
      />
    </Stack>
  );
};
