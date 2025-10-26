import { useAtom } from 'jotai';

import { searchBarEnabledAtom } from '@/app/providers/atoms';
import { Toggle } from '@/shared/ui/Toggle';

interface SearchBarSettingsProps {
  dataTestId?: string;
}

export const SearchBarSettings = ({ dataTestId = 'search-bar-settings' }: SearchBarSettingsProps) => {
  const [searchBarEnabled, setSearchBarEnabled] = useAtom(searchBarEnabledAtom);

  return (
    <div className="space-y-4" data-testid={dataTestId}>
      <div className="text-sm text-fgColor-secondary">Control the visibility of the search functionality</div>

      {/* Enable/Disable Search Bar */}
      <div className="flex items-center justify-between bg-bgColor-primary rounded-lg p-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-fgColor-primary mb-1">Enable Search Bar</div>
          <div className="text-xs text-fgColor-secondary">{searchBarEnabled ? 'Search bar will be shown' : 'Search bar is hidden'}</div>
        </div>
        <Toggle checked={searchBarEnabled} data-testid="search-bar-enabled-toggle" onChange={setSearchBarEnabled} />
      </div>
    </div>
  );
};
