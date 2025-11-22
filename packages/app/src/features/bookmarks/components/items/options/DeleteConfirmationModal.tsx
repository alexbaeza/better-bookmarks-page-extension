import type React from 'react';
import { useTranslation } from '@/i18n/hooks';
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
  title,
  message,
  dataTestId = 'delete-confirmation-modal',
}) => {
  const { t } = useTranslation();
  const modalTitle = title ?? t('bookmarks.actions.deleteItem');
  const modalMessage =
    message ?? t('bookmarks.actions.deleteMessage', { defaultValue: 'This action cannot be undone.' });
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal dataTestId={dataTestId} onClose={onClose} size="sm" title={modalTitle}>
      <Stack data-testid={`${dataTestId}-container`} gap="lg">
        <Text color="secondary" size="sm">
          {modalMessage}
        </Text>
        <Row gap="sm" justifyContent="end">
          <Button data-testid="bookmark-delete-cancel-button" onClick={onClose} variant="secondary">
            {t('common.buttons.cancel')}
          </Button>
          <Button data-testid="bookmark-delete-confirm-button" onClick={handleConfirm} variant="primary">
            {t('common.buttons.delete')}
          </Button>
        </Row>
      </Stack>
    </Modal>
  );
};
