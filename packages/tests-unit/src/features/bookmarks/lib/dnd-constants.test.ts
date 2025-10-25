import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';

describe('dnd-constants', () => {
  it('exports DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX', () => {
    expect(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX).toBe('droppable-fly-out-sidebar-folder-');
  });

  it('exports DROPPABLE_SIDEBAR_FOLDER_PREFIX', () => {
    expect(DROPPABLE_SIDEBAR_FOLDER_PREFIX).toBe('droppable-sidebar-folder-');
  });

  it('exports DROPPABLE_ROOT_FOLDER_PREFIX', () => {
    expect(DROPPABLE_ROOT_FOLDER_PREFIX).toBe('droppable-root-folder-');
  });
});
