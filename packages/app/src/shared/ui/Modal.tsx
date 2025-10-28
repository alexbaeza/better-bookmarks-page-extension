import { X } from 'lucide-react';
import type React from 'react';
import { memo } from 'react';
import { createPortal } from 'react-dom';

import { IconButton } from './IconButton';

export interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dataTestId?: string;
}

export const Modal = memo<ModalProps>(({ onClose, title, children, size = 'md', dataTestId = 'modal' }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  const sizeClasses = {
    lg: 'max-w-lg',
    md: 'max-w-md',
    sm: 'max-w-sm',
    xl: 'max-w-xl',
  };

  const maxClass = sizeClasses[size];

  const handleBackdropKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleContentKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <div
      aria-label="Close modal"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50"
      data-testid={`${dataTestId}-backdrop`}
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      role="button"
      tabIndex={0}
    >
      <dialog
        aria-modal="true"
        className={`relative z-[1000] w-11/12 ${maxClass} rounded-lg bg-bgColor-primary p-6 shadow-lg`}
        data-testid={dataTestId}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleContentKeyDown}
        open
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-semibold text-fgColor-primary" data-testid={`${dataTestId}-title`}>
              {title}
            </h2>
          )}
          <IconButton dataTestId={`${dataTestId}-close-button`} icon={<X size={16} />} onClick={onClose} />
        </div>

        <div>{children}</div>
      </dialog>
    </div>,
    modalRoot
  );
});
