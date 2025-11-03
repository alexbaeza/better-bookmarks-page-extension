import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ZoomControls } from '@/shared/ui/ZoomControls';

const mockUseAtom = vi.fn(() => [1.0, vi.fn()]);
const mockUseSetAtom = vi.fn(() => vi.fn());

vi.mock('jotai', () => ({
  useAtom: () => mockUseAtom(),
  useSetAtom: () => mockUseSetAtom(),
}));

vi.mock('@/app/providers/atoms', () => ({
  zoomAtom: { toString: () => 'zoomAtom' },
  setZoomAtom: { toString: () => 'setZoomAtom' },
  ZOOM_MAX_VALUE: 1.5,
  ZOOM_MIN_VALUE: 0.5,
  ZOOM_STEP: 0.1,
}));

describe('ZoomControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAtom.mockReturnValue([1.0, vi.fn()]);
    mockUseSetAtom.mockReturnValue(vi.fn());
  });

  it('should render without crashing', () => {
    render(<ZoomControls />);
    expect(screen.getByTestId('zoom-controls')).toBeInTheDocument();
  });

  it('should display "Scale" label', () => {
    render(<ZoomControls />);
    expect(screen.getByText('Scale')).toBeInTheDocument();
  });

  it('should display zoom percentage', () => {
    render(<ZoomControls />);
    expect(screen.getByTestId('zoom-display')).toHaveTextContent('100%');
  });

  it('should render plus and minus buttons', () => {
    render(<ZoomControls />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('should have increase scale button with aria-label', () => {
    render(<ZoomControls />);
    expect(screen.getByLabelText('Increase scale')).toBeInTheDocument();
  });

  it('should have decrease scale button with aria-label', () => {
    render(<ZoomControls />);
    expect(screen.getByLabelText('Decrease scale')).toBeInTheDocument();
  });

  describe('settings variant', () => {
    it('should use settings variant by default', () => {
      render(<ZoomControls />);
      const container = screen.getByTestId('zoom-controls');
      expect(container).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('should apply settings text size', () => {
      render(<ZoomControls variant="settings" />);
      const label = screen.getByText('Scale');
      expect(label).toHaveClass('text-sm');
    });
  });

  describe('inline variant', () => {
    it('should apply inline variant classes', () => {
      render(<ZoomControls variant="inline" />);
      const container = screen.getByTestId('zoom-controls');
      expect(container).toHaveClass('mb-4');
    });

    it('should apply inline text size', () => {
      render(<ZoomControls variant="inline" />);
      const label = screen.getByText('Scale');
      expect(label).toHaveClass('text-xs');
    });
  });

  it('should apply custom dataTestId when provided', () => {
    render(<ZoomControls dataTestId="custom-zoom" />);
    expect(screen.getByTestId('custom-zoom')).toBeInTheDocument();
  });

  it('should display zoom display with tabular-nums', () => {
    render(<ZoomControls />);
    const display = screen.getByTestId('zoom-display');
    expect(display).toHaveClass('tabular-nums');
  });

  it('should center zoom display text', () => {
    render(<ZoomControls />);
    const display = screen.getByTestId('zoom-display');
    expect(display).toHaveClass('text-center');
  });
});
