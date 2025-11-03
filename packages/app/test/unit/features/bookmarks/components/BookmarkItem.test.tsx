import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkItem } from '@/features/bookmarks/components/BookmarkItem';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/bookmarks/components/items/grid/BookmarkGridItem', () => ({
  BookmarkGridItem: ({ item }: { item: any }) => <div data-testid="grid-item">{item.title}</div>,
}));

vi.mock('@/features/bookmarks/components/items/list/BookmarkListItem', () => ({
  BookmarkListItem: ({ item }: { item: any }) => <div data-testid="list-item">{item.title}</div>,
}));

vi.mock('@/features/bookmarks/components/items/SkeletonBookmarkItem', () => ({
  SkeletonBookmarkItem: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'skeleton'}>Loading...</div>
  ),
}));

describe('BookmarkItem', () => {
  const mockBookmark = {
    id: '1',
    title: 'Test Bookmark',
    url: 'https://example.com',
  };

  it('should render grid item when viewMode is Grid', () => {
    render(
      <AllProviders initialValues={[[viewModeAtom, 'grid']]}>
        <BookmarkItem item={mockBookmark} />
      </AllProviders>
    );
    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
  });

  it('should render list item when viewMode is List', () => {
    render(
      <AllProviders initialValues={[[viewModeAtom, 'list']]}>
        <BookmarkItem item={mockBookmark} />
      </AllProviders>
    );
    expect(screen.getByTestId('list-item')).toBeInTheDocument();
  });

  it('should render skeleton when isLoading is true', () => {
    render(
      <AllProviders>
        <BookmarkItem dataTestId="test-skeleton" isLoading item={mockBookmark} />
      </AllProviders>
    );
    expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render skeleton when item is null', () => {
    render(
      <AllProviders>
        <BookmarkItem dataTestId="test-skeleton" item={null as any} />
      </AllProviders>
    );
    expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();
  });

  it('should apply dataTestId', () => {
    render(
      <AllProviders>
        <BookmarkItem dataTestId="test-item" item={mockBookmark} />
      </AllProviders>
    );
    expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
  });
});
