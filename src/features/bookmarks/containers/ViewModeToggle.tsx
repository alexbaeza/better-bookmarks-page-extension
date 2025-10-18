import { useAtomValue, useSetAtom } from 'jotai';
import { LayoutGrid, List } from 'lucide-react';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { Toggle } from '@/shared/ui/Toggle';

export const ViewModeToggle: React.FC = () => {
  const viewMode = useAtomValue(viewModeAtom);
  const setViewMode = useSetAtom(viewModeAtom);

  const isGrid = viewMode === BookmarkDisplayMode.Grid;

  return (
    <div className="mr-2 flex justify-end">
      <div className="my-3 flex items-center space-x-2 rounded-lg bg-bgColor-secondary p-2">
        <List size={16} className="text-fgColor-primary" data-testid="list-icon" />
        <Toggle
          data-testid="view-mode-toggle"
          checked={isGrid}
          onChange={(checked) => setViewMode(checked ? BookmarkDisplayMode.Grid : BookmarkDisplayMode.List)}
        />
        <LayoutGrid size={16} className="text-fgColor-primary" data-testid="grid-icon" />
      </div>
    </div>
  );
};
