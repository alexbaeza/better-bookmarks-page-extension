import { X } from 'lucide-react';
import type React from 'react';
import { createPortal } from 'react-dom';

import { IconButton } from './IconButton';

export interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ onClose, title, children, size = 'md' }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
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
    <button
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      aria-label="Close modal"
      type="button"
    >
      <dialog
        open
        aria-modal="true"
        className={`relative z-10 w-11/12 ${maxClass} rounded-lg bg-bgColor-primary p-6 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleContentKeyDown}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold text-fgColor-primary">{title}</h2>}
          <IconButton onClick={onClose} icon={<X size={16} />} dataTestId="modal-close-button" />
        </div>

        <div>{children}</div>
      </dialog>
    </button>,
    modalRoot
  );
};
