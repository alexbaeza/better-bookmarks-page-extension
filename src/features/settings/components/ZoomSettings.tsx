import { useAtom, useSetAtom } from 'jotai';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type React from 'react';

import { maxZoom, minZoom, setZoomAtom, zoomAtom, zoomStep } from '@/app/providers/atoms';
import { IconButton } from '@/shared/ui/IconButton';

interface ZoomSettingsProps {
  dataTestId?: string;
}

export const ZoomSettings: React.FC<ZoomSettingsProps> = ({ dataTestId }) => {
  const [zoom] = useAtom(zoomAtom);
  const setZoom = useSetAtom(setZoomAtom);

  return (
    <div data-testid={dataTestId} className="flex items-center justify-between">
      <div className="text-sm text-fgColor-secondary">Scale</div>
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Increase scale"
          onClick={() => setZoom(zoomStep)}
          icon={<PlusIcon size={14} />}
          disabled={zoom >= maxZoom}
          className="disabled:opacity-50"
        />
        <div className="w-12 text-center text-sm tabular-nums text-fgColor-primary">{Math.round(zoom * 100)}%</div>
        <IconButton
          aria-label="Decrease scale"
          onClick={() => setZoom(-zoomStep)}
          icon={<MinusIcon size={14} />}
          disabled={zoom <= minZoom}
          className="disabled:opacity-50"
        />
      </div>
    </div>
  );
};
