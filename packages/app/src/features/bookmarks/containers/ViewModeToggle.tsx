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
        <List className="text-fgColor-primary" data-testid="list-icon" size={16} />
        <Toggle checked={isGrid} data-testid="view-toggle" onChange={(checked) => setViewMode(checked ? BookmarkDisplayMode.Grid : BookmarkDisplayMode.List)} />
        <LayoutGrid className="text-fgColor-primary" data-testid="grid-icon" size={16} />
      </div>
    </div>
  );
};
