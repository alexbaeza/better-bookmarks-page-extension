import type React from 'react';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Row } from '@/shared/ui/Row';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';

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
      <Stack data-testid={`${dataTestId}-container`} gap="lg">
        <Text color="secondary" size="sm">
          {message}
        </Text>
        <Row gap="sm" justifyContent="end">
          <Button data-testid="bookmark-delete-cancel-button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button data-testid="bookmark-delete-confirm-button" onClick={handleConfirm} variant="primary">
            Delete
          </Button>
        </Row>
      </Stack>
    </Modal>
  );
};
