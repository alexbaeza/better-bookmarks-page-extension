import { useAtom, useSetAtom } from 'jotai';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type React from 'react';

import { setZoomAtom, ZOOM_MAX_VALUE, ZOOM_MIN_VALUE, ZOOM_STEP, zoomAtom } from '@/app/providers/atoms';
import { IconButton } from '@/shared/ui/IconButton';

export type ZoomControlsVariant = 'settings' | 'inline';

export interface ZoomControlsProps {
  variant?: ZoomControlsVariant;
  dataTestId?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ variant = 'settings', dataTestId = 'zoom-controls' }) => {
  const [zoom] = useAtom(zoomAtom);
  const setZoom = useSetAtom(setZoomAtom);

  const isInline = variant === 'inline';
  const textSize = isInline ? 'text-xs' : 'text-sm';
  const buttonSize = isInline ? 'h-6 w-6' : 'h-8 w-8';
  const iconSize = isInline ? 12 : 14;
  const containerClass = isInline ? 'mb-4 flex items-center justify-between' : 'flex items-center justify-between';

  return (
    <div className={containerClass} data-testid={dataTestId}>
      <div className={`${textSize} text-fgColor-secondary`}>Scale</div>
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Increase scale"
          className={`disabled:opacity-50 ${buttonSize}`}
          disabled={zoom >= ZOOM_MAX_VALUE}
          icon={<PlusIcon size={iconSize} />}
          onClick={() => setZoom(ZOOM_STEP)}
        />
        <div className={`w-12 text-center tabular-nums text-fgColor-primary ${textSize}`} data-testid="zoom-display">
          {Math.round(zoom * 100)}%
        </div>
        <IconButton
          aria-label="Decrease scale"
          className={`disabled:opacity-50 ${buttonSize}`}
          disabled={zoom <= ZOOM_MIN_VALUE}
          icon={<MinusIcon size={iconSize} />}
          onClick={() => setZoom(-ZOOM_STEP)}
        />
      </div>
    </div>
  );
};
