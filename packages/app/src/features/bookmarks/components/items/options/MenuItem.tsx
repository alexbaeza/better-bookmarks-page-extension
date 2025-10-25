import { Check, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { IconButton } from '@/shared/ui/IconButton';
import { useClickOutside } from './hooks/useClickOutside';

export interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  animationDurationMs?: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  children,
  onClick,
  onConfirm,
  confirmLabel = 'Are you sure?',
  onCancel,
  animationDurationMs = 200,
}) => {
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    if (confirming) {
      setConfirming(false);
      onCancel?.();
    }
  });

  const [measuredHeight, setMeasuredHeight] = useState(0);
  useEffect(() => {
    if (confirming && ref.current) {
      setMeasuredHeight(ref.current.scrollHeight);
    }
  }, [confirming]);

  const style: React.CSSProperties = confirming
    ? {
        height: measuredHeight,
        overflow: 'hidden',
        transition: `height ${animationDurationMs}ms ease, opacity ${animationDurationMs}ms ease`,
      }
    : {
        height: 'auto',
        transition: `opacity ${animationDurationMs}ms ease`,
      };

  if (!onConfirm) {
    return (
      <button type="button" onClick={onClick} className="flex w-full items-center space-x-2 rounded-lg p-2 text-sm text-fgColor-primary hover:bg-fgColor-hover">
        {icon && <span className="flex-none">{icon}</span>}
        <span className="flex-1 text-left">{children}</span>
      </button>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} style={style} className="w-full">
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex w-full items-center space-x-2 rounded-lg p-2 text-sm text-fgColor-primary hover:bg-fgColor-hover"
        >
          {icon && <span className="flex-none">{icon}</span>}
          <span className="flex-1 text-left">{children}</span>
        </button>
      ) : (
        <div className="flex w-full items-center justify-between space-x-2 rounded bg-fgColor-danger px-3 py-2 text-fgColor-primary">
          <span className="flex-1 text-sm">{confirmLabel}</span>
          <IconButton
            dataTestId="bookmark-delete-confirm-button"
            icon={<Check size={16} />}
            className="text-fgColor-primary"
            onClick={() => {
              onConfirm();
              setConfirming(false);
            }}
          />
          <IconButton
            dataTestId="bookmark-delete-cancel-button"
            icon={<X size={16} />}
            className="text-fgColor-primary"
            onClick={() => {
              setConfirming(false);
              onCancel?.();
            }}
          />
        </div>
      )}
    </div>
  );
};
