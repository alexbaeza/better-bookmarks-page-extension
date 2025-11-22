import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ViewModeToggle } from '@/features/preferences/containers/ViewModeToggle';
import { BookmarkDisplayMode } from '@/shared/types/ui';

let mockSetViewMode: ReturnType<typeof vi.fn>;
let mockViewMode: BookmarkDisplayMode;

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>();
  return {
    ...actual,
    useAtomValue: () => mockViewMode,
    useSetAtom: () => mockSetViewMode,
  };
});

vi.mock('lucide-react', () => ({
  LayoutGrid: ({ size, className, 'data-testid': dataTestId }: any) => (
    <div className={className} data-size={size} data-testid={dataTestId}>
      Grid Icon
    </div>
  ),
  List: ({ size, className, 'data-testid': dataTestId }: any) => (
    <div className={className} data-size={size} data-testid={dataTestId}>
      List Icon
    </div>
  ),
}));

vi.mock('@/shared/ui/Toggle', () => ({
  Toggle: ({ checked, onChange, 'data-testid': dataTestId }: any) => (
    <button data-checked={checked} data-testid={dataTestId} onClick={() => onChange(!checked)} type="button">
      Toggle
    </button>
  ),
}));

describe('ViewModeToggle', () => {
  beforeEach(() => {
    mockSetViewMode = vi.fn();
    mockViewMode = BookmarkDisplayMode.Grid;
  });

  it('should render list and grid icons', () => {
    render(<ViewModeToggle />);

    expect(screen.getByTestId('list-icon')).toBeInTheDocument();
    expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
  });

  it('should show toggle in checked state for grid mode', () => {
    mockViewMode = BookmarkDisplayMode.Grid;
    render(<ViewModeToggle />);

    const toggle = screen.getByTestId('view-toggle');
    expect(toggle).toHaveAttribute('data-checked', 'true');
  });

  it('should show toggle in unchecked state for list mode', () => {
    mockViewMode = BookmarkDisplayMode.List;
    render(<ViewModeToggle />);

    const toggle = screen.getByTestId('view-toggle');
    expect(toggle).toHaveAttribute('data-checked', 'false');
  });

  it('should call setViewMode when toggle is clicked to grid', async () => {
    mockViewMode = BookmarkDisplayMode.List;
    const user = userEvent.setup();
    render(<ViewModeToggle />);

    const toggle = screen.getByTestId('view-toggle');
    await user.click(toggle);

    expect(mockSetViewMode).toHaveBeenCalledWith(BookmarkDisplayMode.Grid);
  });

  it('should call setViewMode when toggle is clicked to list', async () => {
    mockViewMode = BookmarkDisplayMode.Grid;
    const user = userEvent.setup();
    render(<ViewModeToggle />);

    const toggle = screen.getByTestId('view-toggle');
    await user.click(toggle);

    expect(mockSetViewMode).toHaveBeenCalledWith(BookmarkDisplayMode.List);
  });

  it('should render icons with correct size', () => {
    render(<ViewModeToggle />);

    const listIcon = screen.getByTestId('list-icon');
    const gridIcon = screen.getByTestId('grid-icon');

    expect(listIcon).toHaveAttribute('data-size', '16');
    expect(gridIcon).toHaveAttribute('data-size', '16');
  });
});
