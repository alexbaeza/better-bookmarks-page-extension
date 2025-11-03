import { useAtomValue, useSetAtom } from 'jotai';
import { LayoutGrid, List } from 'lucide-react';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { Row } from '@/shared/ui/Row';
import { Toggle } from '@/shared/ui/Toggle';

export const ViewModeToggle: React.FC = () => {
  const viewMode = useAtomValue(viewModeAtom);
  const setViewMode = useSetAtom(viewModeAtom);

  const isGrid = viewMode === BookmarkDisplayMode.Grid;

  return (
    <Row alignItems="center" className="rounded-lg bg-bgColor-secondary p-2" gap="md" justifyContent="end">
      <List className="text-fgColor-primary" data-testid="list-icon" size={16} />
      <Toggle
        checked={isGrid}
        data-testid="view-toggle"
        onChange={(checked) => setViewMode(checked ? BookmarkDisplayMode.Grid : BookmarkDisplayMode.List)}
      />
      <LayoutGrid className="text-fgColor-primary" data-testid="grid-icon" size={16} />
    </Row>
  );
};
