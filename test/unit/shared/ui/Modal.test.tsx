import { vi } from 'vitest';

import { Modal } from '@/shared/ui/Modal';
import { fireEvent, render, screen } from '~test/test-utils';

vi.mock('react-dom', () => ({
  createPortal: vi.fn((children) => children),
}));

vi.mock('../../../src/components/ui/IconButton', () => ({
  IconButton: ({ onClick, dataTestId }: { onClick: () => void; dataTestId: string }) => (
    <button type="button" onClick={onClick} data-testid={dataTestId}>
      Close
    </button>
  ),
}));

describe('Modal', () => {
  let modalRoot: HTMLElement;

  beforeEach(() => {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);

    const originalGetElementById = document.getElementById;
    document.getElementById = vi.fn((id) => {
      if (id === 'modal-root') return modalRoot;
      return originalGetElementById.call(document, id);
    });
  });

  afterEach(() => {
    document.body.removeChild(modalRoot);
  });

  it('renders with title', () => {
    render(
      <Modal title="Test Modal" onClose={() => {}}>
        Content
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(<Modal onClose={() => {}}>Content</Modal>);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    const backdrop = screen.getByRole('button', { name: 'Close modal' });
    expect(backdrop).toBeTruthy();
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    render(
      <Modal size="lg" onClose={() => {}}>
        Content
      </Modal>
    );

    const modalContainer = screen.getByText('Content').parentElement;
    expect(modalContainer).toHaveClass('max-w-lg');
  });

  it('defaults to md size', () => {
    render(<Modal onClose={() => {}}>Content</Modal>);

    const modalContainer = screen.getByText('Content').parentElement;
    expect(modalContainer).toHaveClass('max-w-md');
  });

  it('has correct structure', () => {
    render(
      <Modal title="Test" onClose={() => {}}>
        Content
      </Modal>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
