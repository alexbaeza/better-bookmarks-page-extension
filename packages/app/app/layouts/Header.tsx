import { useAtomValue } from 'jotai';
import type React from 'react';

import { greetingShownAtom, searchBarEnabledAtom } from '@/app/providers/atoms';
import { ViewModeToggle } from '@/features/bookmarks/containers/ViewModeToggle';
import { Greeting } from '@/features/greeting/components/Greeting';
import { SearchBar } from '@/features/search/containers/SearchBar';
import { SettingsToggle } from '@/features/settings/containers/SettingsToggle';

export const Header: React.FC = () => {
  const showGreeting = useAtomValue(greetingShownAtom);
  const showSearch = useAtomValue(searchBarEnabledAtom);

  return (
    <header className="w-full bg-bgColor-primary px-6 py-4">
      {/* Top row: Greeting left, controls right */}
      <div className="flex w-full items-center justify-between">
        <div className="min-w-0">{showGreeting && <Greeting />}</div>
        <div className="flex items-center gap-4">
          <ViewModeToggle />
          <SettingsToggle />
        </div>
      </div>

      {/* Center row: Search */}
      {showSearch && (
        <div className="mt-4 flex w-full justify-center">
          <SearchBar />
        </div>
      )}
    </header>
  );
};
