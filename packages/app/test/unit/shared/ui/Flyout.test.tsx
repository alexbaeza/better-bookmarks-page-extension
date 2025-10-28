import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Flyout, InlineFlyout } from '@/shared/ui/Flyout';
import { AllProviders } from '~test/test-utils';

describe('Flyout', () => {
  const mockOnClose = vi.fn();

  it('renders when isOpen is true', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    expect(screen.getByText('Flyout content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <AllProviders>
        <Flyout isOpen={false} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    expect(screen.queryByText('Flyout content')).not.toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <AllProviders>
        <Flyout data-testid="custom-flyout" isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    expect(screen.getByTestId('custom-flyout')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const overlay = screen.getByTestId('flyout-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when flyout content is clicked', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const content = screen.getByText('Flyout content');
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders on right side by default', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const flyout = screen.getByTestId('flyout-container');
    expect(flyout).toHaveClass('right-0');
  });

  it('renders on left side when specified', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose} side="left">
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const flyout = screen.getByTestId('flyout-container');
    expect(flyout).toHaveClass('left-0');
  });

  it('applies custom width class', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose} widthClass="w-96">
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const flyout = screen.getByTestId('flyout-container');
    expect(flyout).toHaveClass('w-96');
  });

  it('applies custom className', () => {
    render(
      <AllProviders>
        <Flyout className="custom-class" isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const flyout = screen.getByTestId('flyout-container');
    expect(flyout).toHaveClass('custom-class');
  });

  it('renders with overlay by default', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const overlay = screen.getByTestId('flyout-overlay');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-[100]', 'bg-black', 'bg-opacity-50');
  });

  it('renders without overlay when withOverlay is false', () => {
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose} withOverlay={false}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const overlay = screen.getByText('Flyout content').closest('div')?.parentElement;
    expect(overlay).not.toHaveClass('bg-black', 'bg-opacity-50');
  });

  it('calls onClose when Escape key is pressed on overlay', () => {
    mockOnClose.mockClear();
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const overlay = screen.getByTestId('flyout-overlay');
    fireEvent.keyDown(overlay, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed on flyout container', () => {
    mockOnClose.mockClear();
    render(
      <AllProviders>
        <Flyout isOpen={true} onClose={mockOnClose}>
          <div>Flyout content</div>
        </Flyout>
      </AllProviders>
    );

    const flyout = screen.getByTestId('flyout-container');
    fireEvent.keyDown(flyout, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders InlineFlyout', () => {
    render(
      <AllProviders>
        <InlineFlyout>
          <div>Inline flyout content</div>
        </InlineFlyout>
      </AllProviders>
    );

    expect(screen.getByText('Inline flyout content')).toBeInTheDocument();
  });
});
