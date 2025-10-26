import { useAtom, useSetAtom } from 'jotai';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type React from 'react';

import { setZoomAtom, ZOOM_MAX_VALUE, ZOOM_MIN_VALUE, ZOOM_STEP, zoomAtom } from '@/app/providers/atoms';
import { IconButton } from '@/shared/ui/IconButton';

interface ZoomSettingsProps {
  dataTestId?: string;
}

export const ZoomSettings: React.FC<ZoomSettingsProps> = ({ dataTestId = 'zoom-settings' }) => {
  const [zoom] = useAtom(zoomAtom);
  const setZoom = useSetAtom(setZoomAtom);

  return (
    <div className="flex items-center justify-between" data-testid={dataTestId}>
      <div className="text-sm text-fgColor-secondary">Scale</div>
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Increase scale"
          className="disabled:opacity-50"
          disabled={zoom >= ZOOM_MAX_VALUE}
          icon={<PlusIcon size={14} />}
          onClick={() => setZoom(ZOOM_STEP)}
        />
        <div className="w-12 text-center text-sm tabular-nums text-fgColor-primary" data-testid="zoom-display">
          {Math.round(zoom * 100)}%
        </div>
        <IconButton
          aria-label="Decrease scale"
          className="disabled:opacity-50"
          disabled={zoom <= ZOOM_MIN_VALUE}
          icon={<MinusIcon size={14} />}
          onClick={() => setZoom(-ZOOM_STEP)}
        />
      </div>
    </div>
  );
};
