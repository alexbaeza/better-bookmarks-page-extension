import { useAtom, useSetAtom } from 'jotai';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type React from 'react';

import { maxZoom, minZoom, setZoomAtom, zoomAtom, zoomStep } from '@/app/providers/atoms';
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
          onClick={() => setZoom(zoomStep)}
          icon={<PlusIcon size={12} />}
          disabled={zoom >= maxZoom}
          className="h-6 w-6 disabled:opacity-50"
        />
        <span className="w-10 text-center text-xs tabular-nums text-fgColor-primary">{Math.round(zoom * 100)}%</span>
        <IconButton
          aria-label="Decrease scale"
          onClick={() => setZoom(-zoomStep)}
          icon={<MinusIcon size={12} />}
          disabled={zoom <= minZoom}
          className="h-6 w-6 disabled:opacity-50"
        />
      </div>
    </div>
  );
};
