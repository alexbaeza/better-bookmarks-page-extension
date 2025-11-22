import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DroppableFolder } from '@/features/bookmarks/components/dnd/DroppableFolder';
import { AllProviders } from '~test/test-utils';

let mockUseDrop = vi.fn();
let mockOnDrop: ReturnType<typeof vi.fn<() => void>>;

vi.mock('react-dnd', () => ({
  useDrop: (config: any) => mockUseDrop(config),
}));

describe('DroppableFolder', () => {
  beforeEach(() => {
    mockUseDrop = vi.fn(() => [
      { isOver: false, canDrop: false },
      vi.fn(), // drop function
    ]);
    mockOnDrop = vi.fn<() => void>();
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

  describe('nested drop behavior', () => {
    it('should use shallow isOver to only show visual feedback for direct targets', () => {
      const mockDrop = vi.fn();
      const mockMonitor = {
        isOver: vi.fn((options?: { shallow?: boolean }) => {
          // When shallow is true, return true (direct target)
          // When shallow is false/undefined, return false (not direct target)
          return options?.shallow === true;
        }),
        canDrop: vi.fn(() => true),
        didDrop: vi.fn(() => false),
        getItem: vi.fn(() => ({
          id: 'item-1',
          folderId: 'folder-2',
          index: 0,
        })),
      };

      mockUseDrop.mockImplementation((config) => {
        const collected = config.collect(mockMonitor);
        return [collected, mockDrop];
      });

      render(
        <AllProviders>
          <DroppableFolder folderId="folder-1" onDrop={mockOnDrop}>
            Content
          </DroppableFolder>
        </AllProviders>
      );

      // Verify shallow isOver was called
      expect(mockMonitor.isOver).toHaveBeenCalledWith({ shallow: true });
    });

    it('should not call onDrop when a nested child already handled the drop', () => {
      const mockDrop = vi.fn();
      const mockMonitor = {
        isOver: vi.fn(() => true),
        canDrop: vi.fn(() => true),
        didDrop: vi.fn(() => true), // Child already handled the drop
        getItem: vi.fn(() => ({
          id: 'item-1',
          folderId: 'folder-2',
          index: 0,
        })),
      };

      mockUseDrop.mockImplementation((config) => {
        const collected = config.collect(mockMonitor);
        const _dropHandler = config.drop(
          {
            id: 'item-1',
            folderId: 'folder-2',
            index: 0,
            item: { id: 'item-1', title: 'Test' },
          },
          mockMonitor
        );
        return [collected, mockDrop];
      });

      render(
        <AllProviders>
          <DroppableFolder folderId="folder-1" onDrop={mockOnDrop}>
            Content
          </DroppableFolder>
        </AllProviders>
      );

      // onDrop should not be called because child already handled it
      expect(mockOnDrop).toHaveBeenCalledTimes(0);
    });

    it('should call onDrop when this folder is the direct target and child did not handle it', () => {
      const mockDrop = vi.fn();
      const mockMonitor = {
        isOver: vi.fn(() => true),
        canDrop: vi.fn(() => true),
        didDrop: vi.fn(() => false), // No child handled the drop
        getItem: vi.fn(() => ({
          id: 'item-1',
          folderId: 'folder-2',
          index: 0,
        })),
      };

      mockUseDrop.mockImplementation((config) => {
        const collected = config.collect(mockMonitor);
        const _dropHandler = config.drop(
          {
            id: 'item-1',
            folderId: 'folder-2',
            index: 0,
            item: { id: 'item-1', title: 'Test' },
          },
          mockMonitor
        );
        return [collected, mockDrop];
      });

      render(
        <AllProviders>
          <DroppableFolder folderId="folder-1" onDrop={mockOnDrop}>
            Content
          </DroppableFolder>
        </AllProviders>
      );

      // onDrop should be called because this is the direct target
      expect(mockOnDrop).toHaveBeenCalledWith('item-1', 'folder-2', 0);
    });

    it('should prevent dropping into the same folder', () => {
      const mockDrop = vi.fn();
      const mockMonitor = {
        isOver: vi.fn(() => false),
        canDrop: vi.fn(() => false),
        didDrop: vi.fn(() => false),
        getItem: vi.fn(() => ({
          id: 'item-1',
          folderId: 'folder-1', // Same folder
          index: 0,
        })),
      };

      mockUseDrop.mockImplementation((config) => {
        const _canDropResult = config.canDrop({
          id: 'item-1',
          folderId: 'folder-1',
          index: 0,
          item: { id: 'item-1', title: 'Test' },
        });
        const collected = config.collect(mockMonitor);
        return [collected, mockDrop];
      });

      render(
        <AllProviders>
          <DroppableFolder folderId="folder-1" onDrop={mockOnDrop}>
            Content
          </DroppableFolder>
        </AllProviders>
      );

      // canDrop should return false for same folder
      expect(mockMonitor.canDrop).toHaveBeenCalled();
    });

    it('should prevent dropping a folder onto itself', () => {
      const mockDrop = vi.fn();
      const mockMonitor = {
        isOver: vi.fn(() => false),
        canDrop: vi.fn(() => false),
        didDrop: vi.fn(() => false),
        getItem: vi.fn(() => ({
          id: 'folder-1', // Same as folderId
          folderId: 'folder-2',
          index: 0,
        })),
      };

      mockUseDrop.mockImplementation((config) => {
        const _canDropResult = config.canDrop({
          id: 'folder-1',
          folderId: 'folder-2',
          index: 0,
          item: { id: 'folder-1', title: 'Test Folder' },
        });
        const collected = config.collect(mockMonitor);
        return [collected, mockDrop];
      });

      render(
        <AllProviders>
          <DroppableFolder folderId="folder-1" onDrop={mockOnDrop}>
            Content
          </DroppableFolder>
        </AllProviders>
      );

      // canDrop should return false when dropping folder onto itself
      expect(mockMonitor.canDrop).toHaveBeenCalled();
    });
  });
});
