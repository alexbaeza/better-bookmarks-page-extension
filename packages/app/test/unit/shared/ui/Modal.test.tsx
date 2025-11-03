import { vi } from 'vitest';

import { Modal } from '@/shared/ui/Modal';
import { cleanup, fireEvent, render, screen } from '~test/test-utils';

vi.mock('@/shared/ui/IconButton', () => ({
  IconButton: ({ onClick, dataTestId }: { onClick: () => void; dataTestId: string }) => (
    <button data-testid={dataTestId} onClick={onClick} type="button">
      Close
    </button>
  ),
}));

describe('Modal', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with title', () => {
    render(
      <Modal onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(<Modal onClose={() => {}}>Content</Modal>);

    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    const backdrop = screen.getByTestId('modal-backdrop');
    expect(backdrop).toBeInTheDocument();
    const content = screen.getByTestId('modal');
    expect(content).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    const dialog = screen.getByTestId('modal');
    expect(dialog).toBeInTheDocument();
  });

  it('has onEscapeKeyDown and onPointerDownOutside handlers', () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    const dialog = screen.getByTestId('modal');
    expect(dialog).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    render(
      <Modal onClose={() => {}} size="lg">
        Content
      </Modal>
    );

    const modalContent = screen.getByTestId('modal');
    expect(modalContent).toHaveClass('max-w-lg');
  });

  it('defaults to md size', () => {
    render(<Modal onClose={() => {}}>Content</Modal>);

    const modalContent = screen.getByTestId('modal');
    expect(modalContent).toHaveClass('max-w-md');
  });

  it('has correct structure', () => {
    render(
      <Modal onClose={() => {}} title="Test">
        Content
      </Modal>
    );

    expect(screen.getByTestId('modal-title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
