import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { viewModeAtom } from '@/app/providers/atoms';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { render, screen } from '~test/test-utils';

describe('SkeletonBookmarkItem', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtomValue');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders list skeleton when viewMode is list', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);

    render(<SkeletonBookmarkItem viewMode={BookmarkDisplayMode.List} />);

    const skeleton = screen.getByTestId('bookmark-skeleton-item');
    expect(skeleton).toHaveClass('relative flex h-12 w-full animate-pulse overflow-visible rounded-lg bg-bgColor-secondary');
  });

  it('renders grid skeleton when viewMode is grid', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    render(<SkeletonBookmarkItem viewMode={BookmarkDisplayMode.Grid} />);

    const skeleton = screen.getByTestId('bookmark-skeleton-item');
    expect(skeleton).toHaveClass('relative flex w-24 animate-pulse flex-col items-center gap-1 rounded-lg bg-bgColor-secondary p-2 break-inside-avoid');
  });

  it('uses custom dataTestId', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    render(<SkeletonBookmarkItem dataTestId="custom-skeleton" viewMode={BookmarkDisplayMode.List} />);

    expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
  });
});
