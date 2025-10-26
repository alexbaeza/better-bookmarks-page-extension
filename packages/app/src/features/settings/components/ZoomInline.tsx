import { useAtom, useSetAtom } from 'jotai';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type React from 'react';

import { setZoomAtom, ZOOM_MAX_VALUE, ZOOM_MIN_VALUE, ZOOM_STEP, zoomAtom } from '@/app/providers/atoms';
import { IconButton } from '@/shared/ui/IconButton';

export const ZoomInline: React.FC = () => {
  const [zoom] = useAtom(zoomAtom);
  const setZoom = useSetAtom(setZoomAtom);

  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="text-xs font-semibold uppercase text-fgColor-secondary">Scale</span>
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Increase scale"
          className="h-6 w-6 disabled:opacity-50"
          disabled={zoom >= ZOOM_MAX_VALUE}
          icon={<PlusIcon size={12} />}
          onClick={() => setZoom(ZOOM_STEP)}
        />
        <span className="w-10 text-center text-xs tabular-nums text-fgColor-primary">{Math.round(zoom * 100)}%</span>
        <IconButton
          aria-label="Decrease scale"
          className="h-6 w-6 disabled:opacity-50"
          disabled={zoom <= ZOOM_MIN_VALUE}
          icon={<MinusIcon size={12} />}
          onClick={() => setZoom(-ZOOM_STEP)}
        />
      </div>
    </div>
  );
};
