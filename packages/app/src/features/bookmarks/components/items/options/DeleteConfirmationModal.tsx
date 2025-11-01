import type React from 'react';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  dataTestId?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete item?',
  message = 'This action cannot be undone.',
  dataTestId = 'delete-confirmation-modal',
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal dataTestId={dataTestId} onClose={onClose} size="sm" title={title}>
      <div className="space-y-4" data-testid={`${dataTestId}-container`}>
        <p className="text-sm text-fgColor-secondary">{message}</p>
        <div className="flex justify-end gap-2">
          <Button data-testid="bookmark-delete-cancel-button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button data-testid="bookmark-delete-confirm-button" onClick={handleConfirm} variant="primary">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
