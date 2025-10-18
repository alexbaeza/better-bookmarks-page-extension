import type React from 'react';
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
}

export const Flyout: React.FC<FlyoutProps> = ({ isOpen, onClose, side = 'right', widthClass = 'w-[28rem]', withOverlay = true, className = '', children }) => {
  const handleOverlayKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;
  return createPortal(
    <>
      {withOverlay && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
          onKeyDown={handleOverlayKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Close flyout"
        />
      )}
      <div
        className={`fixed top-0 z-50 h-full ${widthClass} bg-bgColor-primary shadow-2xl transform transition-transform duration-300 ease-in-out ${
          side === 'right' ? 'right-0' : 'left-0'
        } ${className}`}
        role="dialog"
        aria-modal="true"
        style={{
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
          position: 'fixed',
          top: 0,
          height: '100%',
          ...(side === 'right' ? { right: 0 } : { left: 0 }),
        }}
      >
        <div className="flex h-full flex-col">{children}</div>
      </div>
    </>,
    document.body
  );
};

interface InlineFlyoutProps {
  side?: Side;
  widthClass?: string;
  className?: string;
  children: React.ReactNode;
}

export const InlineFlyout: React.FC<InlineFlyoutProps> = ({ side = 'right', widthClass = 'w-64', className = '', children }) => {
  return (
    <aside
      className={`flex ${widthClass} shrink-0 flex-col border-l border-bgColor-tertiary bg-bgColor-secondary p-4 ${className} ${side === 'right' ? '' : ''}`}
    >
      {children}
    </aside>
  );
};
