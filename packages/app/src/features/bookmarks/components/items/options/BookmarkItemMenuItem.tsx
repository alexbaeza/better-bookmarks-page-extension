import { Check, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@/features/bookmarks/hooks/useClickOutside';
import { IconButton } from '@/shared/ui/IconButton';

export interface BookmarkItemMenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  animationDurationMs?: number;
  dataTestId?: string;
}

export const BookmarkItemMenuItem: React.FC<BookmarkItemMenuItemProps> = ({
  icon,
  children,
  onClick,
  onConfirm,
  confirmLabel = 'Are you sure?',
  onCancel,
  animationDurationMs = 200,
  dataTestId = 'menu-item',
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
      <button
        className="flex w-full items-center space-x-2 rounded-lg p-2 text-sm text-fgColor-primary hover:bg-fgColor-hover"
        data-testid={dataTestId}
        onClick={onClick}
        type="button"
      >
        {icon && <span className="flex-none">{icon}</span>}
        <span className="flex-1 text-left">{children}</span>
      </button>
    );
  }

  return (
    <div className="w-full" ref={ref as React.Ref<HTMLDivElement>} style={style}>
      {!confirming ? (
        <button
          className="flex w-full items-center space-x-2 rounded-lg p-2 text-sm text-fgColor-primary hover:bg-fgColor-hover"
          data-testid={dataTestId}
          onClick={() => setConfirming(true)}
          type="button"
        >
          {icon && <span className="flex-none">{icon}</span>}
          <span className="flex-1 text-left">{children}</span>
        </button>
      ) : (
        <div className="flex w-full items-center justify-between space-x-2 rounded bg-fgColor-danger px-3 py-2 text-fgColor-primary">
          <span className="flex-1 text-sm">{confirmLabel}</span>
          <IconButton
            className="text-fgColor-primary"
            dataTestId="bookmark-delete-confirm-button"
            icon={<Check size={16} />}
            onClick={() => {
              onConfirm();
              setConfirming(false);
            }}
          />
          <IconButton
            className="text-fgColor-primary"
            dataTestId="bookmark-delete-cancel-button"
            icon={<X size={16} />}
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
