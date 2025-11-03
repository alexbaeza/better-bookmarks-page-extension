import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DroppableFolder } from '@/features/bookmarks/components/dnd/DroppableFolder';
import { AllProviders } from '~test/test-utils';

const mockUseDrop = vi.fn();
const mockOnDrop = vi.fn();

vi.mock('react-dnd', () => ({
  useDrop: () => mockUseDrop(),
}));

describe('DroppableFolder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDrop.mockReturnValue([
      { isOver: false, canDrop: false },
      vi.fn(), // drop function
    ]);
  });

  it('should render without crashing', () => {
    render(
      <AllProviders>
        <DroppableFolder folderId="folder-1" onDrop={mockOnDrop}>
          Content
        </DroppableFolder>
      </AllProviders>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply dataTestId', () => {
    render(
      <AllProviders>
        <DroppableFolder dataTestId="test-folder" folderId="folder-1" onDrop={mockOnDrop}>
          Content
        </DroppableFolder>
      </AllProviders>
    );

    expect(screen.getByTestId('test-folder')).toBeInTheDocument();
  });
});
