import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type React from 'react';
import { memo } from 'react';

import { IconButton } from './IconButton';

export interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dataTestId?: string;
}

const sizeClasses = {
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
  xl: 'max-w-xl',
} as const;

export const Modal = memo<ModalProps>(({ onClose, title, children, size = 'md', dataTestId = 'modal' }) => {
  return (
    <Dialog.Root modal onOpenChange={(open) => !open && onClose()} open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[999] bg-black bg-opacity-50" data-testid={`${dataTestId}-backdrop`} />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-[1000] w-11/12 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-bgColor-primary p-6 shadow-lg focus:outline-none ${sizeClasses[size]}`}
          data-testid={dataTestId}
          onEscapeKeyDown={onClose}
          onPointerDownOutside={onClose}
        >
          <div className="mb-4 flex items-center justify-between">
            {title && (
              <Dialog.Title className="text-lg font-semibold text-fgColor-primary" data-testid={`${dataTestId}-title`}>
                {title}
              </Dialog.Title>
            )}
            <Dialog.Close asChild>
              <IconButton dataTestId={`${dataTestId}-close-button`} icon={<X size={16} />} onClick={onClose} />
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">Modal dialog</Dialog.Description>

          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
