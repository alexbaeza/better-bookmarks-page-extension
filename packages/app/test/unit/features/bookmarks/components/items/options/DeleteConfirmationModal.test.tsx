import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteConfirmationModal } from '@/features/bookmarks/components/items/options/DeleteConfirmationModal';
import { AllProviders } from '~test/test-utils';

describe('DeleteConfirmationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <AllProviders>
        <DeleteConfirmationModal isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />
      </AllProviders>
    );
    expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <AllProviders>
        <DeleteConfirmationModal isOpen onClose={mockOnClose} onConfirm={mockOnConfirm} />
      </AllProviders>
    );
    expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument();
  });

  it('should render default title and message', () => {
    render(
      <AllProviders>
        <DeleteConfirmationModal isOpen onClose={mockOnClose} onConfirm={mockOnConfirm} />
      </AllProviders>
    );
    expect(screen.getByText('Delete item?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('should render custom title and message', () => {
    render(
      <AllProviders>
        <DeleteConfirmationModal
          isOpen
          message="Custom message"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Custom title"
        />
      </AllProviders>
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <DeleteConfirmationModal isOpen onClose={mockOnClose} onConfirm={mockOnConfirm} />
      </AllProviders>
    );
    await user.click(screen.getByTestId('bookmark-delete-cancel-button'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm and onClose when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <DeleteConfirmationModal isOpen onClose={mockOnClose} onConfirm={mockOnConfirm} />
      </AllProviders>
    );
    await user.click(screen.getByTestId('bookmark-delete-confirm-button'));
    expect(mockOnConfirm).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should apply custom dataTestId', () => {
    render(
      <AllProviders>
        <DeleteConfirmationModal dataTestId="custom-modal" isOpen onClose={mockOnClose} onConfirm={mockOnConfirm} />
      </AllProviders>
    );
    expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
    expect(screen.getByTestId('custom-modal-container')).toBeInTheDocument();
  });
});
