import { describe, expect, it } from 'vitest';
import {
  type BaseItemProps,
  BookmarkDisplayMode,
  type BookmarkItemProps,
  type HoverState,
  type ViewModeProps,
} from '@/shared/types/ui';

describe('ui types', () => {
  describe('BookmarkDisplayMode', () => {
    it('should have Grid mode', () => {
      expect(BookmarkDisplayMode.Grid).toBe('grid');
    });

    it('should have List mode', () => {
      expect(BookmarkDisplayMode.List).toBe('list');
    });

    it('should have exactly 2 modes', () => {
      const modes = Object.values(BookmarkDisplayMode);
      expect(modes).toHaveLength(2);
    });

    it('should be usable in switch statements', () => {
      const mode = BookmarkDisplayMode.Grid;
      let result: string;

      switch (mode) {
        case BookmarkDisplayMode.Grid:
          result = 'grid';
          break;
        case BookmarkDisplayMode.List:
          result = 'list';
          break;
        default:
          result = 'unknown';
      }

      expect(result).toBe('grid');
    });
  });

  describe('BaseItemProps', () => {
    it('should accept required props', () => {
      const props: BaseItemProps = {
        icon: 'icon',
        title: 'Test',
        onEdit: () => {},
        onDelete: () => {},
      };

      expect(props.title).toBe('Test');
      expect(props.icon).toBe('icon');
    });

    it('should accept all optional props', () => {
      const props: BaseItemProps = {
        dataTestId: 'test-id',
        icon: 'icon',
        title: 'Test',
        url: 'https://example.com',
        onClick: () => {},
        onEdit: () => {},
        onDelete: () => {},
        dragHandleProps: { className: 'drag' },
        children: 'child',
      };

      expect(props.dataTestId).toBe('test-id');
      expect(props.url).toBe('https://example.com');
      expect(props.onClick).toBeDefined();
      expect(props.dragHandleProps).toBeDefined();
      expect(props.children).toBe('child');
    });
  });

  describe('BookmarkItemProps', () => {
    it('should extend BaseItemProps with item', () => {
      const props: BookmarkItemProps = {
        item: { id: '1', title: 'Test' },
        icon: 'icon',
        title: 'Test',
        onEdit: () => {},
        onDelete: () => {},
      };

      expect(props.item.id).toBe('1');
      expect(props.item.title).toBe('Test');
    });

    it('should accept optional onFolderClick', () => {
      const onFolderClick = () => {};
      const props: BookmarkItemProps = {
        item: { id: '1', title: 'Test' },
        icon: 'icon',
        title: 'Test',
        onEdit: () => {},
        onDelete: () => {},
        onFolderClick,
      };

      expect(props.onFolderClick).toBe(onFolderClick);
    });
  });

  describe('ViewModeProps', () => {
    it('should accept grid view mode', () => {
      const props: ViewModeProps = {
        viewMode: 'grid',
      };

      expect(props.viewMode).toBe('grid');
    });

    it('should accept list view mode', () => {
      const props: ViewModeProps = {
        viewMode: 'list',
      };

      expect(props.viewMode).toBe('list');
    });
  });

  describe('HoverState', () => {
    it('should have all required properties', () => {
      const hoverState: HoverState = {
        hovered: false,
        clearHide: () => {},
        scheduleHide: () => {},
        onMouseEnter: () => {},
        onMouseLeave: () => {},
      };

      expect(hoverState.hovered).toBe(false);
      expect(typeof hoverState.clearHide).toBe('function');
      expect(typeof hoverState.scheduleHide).toBe('function');
      expect(typeof hoverState.onMouseEnter).toBe('function');
      expect(typeof hoverState.onMouseLeave).toBe('function');
    });

    it('should accept hovered as true', () => {
      const hoverState: HoverState = {
        hovered: true,
        clearHide: () => {},
        scheduleHide: () => {},
        onMouseEnter: () => {},
        onMouseLeave: () => {},
      };

      expect(hoverState.hovered).toBe(true);
    });
  });
});
