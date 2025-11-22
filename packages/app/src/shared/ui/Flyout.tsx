import type React from 'react';
import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Side = 'left' | 'right';

interface FlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  side?: Side;
  widthClass?: string; // e.g. w-[28rem]
  withOverlay?: boolean;
  className?: string;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const Flyout = memo<FlyoutProps>(
  ({
    isOpen,
    onClose,
    side = 'right',
    widthClass = 'w-[28rem]',
    withOverlay = true,
    className = '',
    children,
    'data-testid': dataTestId,
  }) => {
    const handleOverlayKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleFlyoutKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add global Escape key listener when flyout is open
    useEffect(() => {
      if (!isOpen) return;

      const handleGlobalKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return createPortal(
      <>
        {withOverlay && (
          <div
            aria-label="Close flyout"
            className="fixed inset-0 z-[100] bg-black bg-opacity-50"
            data-testid="flyout-overlay"
            onClick={onClose}
            onKeyDown={handleOverlayKeyDown}
            role="button"
            tabIndex={0}
          />
        )}
        <div
          aria-modal="true"
          className={`fixed top-0 z-[200] h-full ${widthClass} bg-bgColor-primary shadow-2xl transform transition-transform duration-300 ease-in-out ${
            side === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
          data-testid={dataTestId || 'flyout-container'}
          onKeyDown={handleFlyoutKeyDown}
          role="dialog"
          style={{
            border: 'none',
            height: '100%',
            margin: 0,
            outline: 'none',
            padding: 0,
            position: 'fixed',
            top: 0,
            ...(side === 'right' ? { right: 0 } : { left: 0 }),
          }}
          tabIndex={-1}
        >
          <div className="flex h-full flex-col">{children}</div>
        </div>
      </>,
      document.body
    );
  }
);

interface InlineFlyoutProps {
  side?: Side;
  widthClass?: string;
  className?: string;
  children: React.ReactNode;
}

export const InlineFlyout = memo<InlineFlyoutProps>(
  ({ side = 'right', widthClass = 'w-64', className = '', children }) => {
    return (
      <aside
        className={`flex ${widthClass} shrink-0 flex-col border-l border-bgColor-secondary/30 bg-bgColor-secondary px-2 py-1 ${className} ${side === 'right' ? '' : ''}`}
        data-testid="sidebar-flyout"
      >
        {children}
      </aside>
    );
  }
);
