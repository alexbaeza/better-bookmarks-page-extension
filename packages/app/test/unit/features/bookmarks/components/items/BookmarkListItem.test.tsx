import { vi } from 'vitest';

import { BookmarkListItem } from '@/features/bookmarks/components/items/list/BookmarkListItem';
import { renderWithBookmarkProviders, screen } from '~test/test-utils';

describe('BookmarkListItem', () => {
  const title = 'Example Bookmark';
  const url = 'https://www.example.com';

  it('renders the title and favicon correctly', () => {
    renderWithBookmarkProviders(<BookmarkListItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId('favicon')).toBeInTheDocument();
  });

  it('renders the link with the correct href', () => {
    renderWithBookmarkProviders(<BookmarkListItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    const link = screen.getByTestId('list-item-link');
    expect(link).toHaveAttribute('href', url);
  });

  it('renders with a custom data-testid if passed', () => {
    const customTestId = 'custom-list-item-test-id';
    renderWithBookmarkProviders(<BookmarkListItem dataTestId={customTestId} onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('renders with a default data-testid if not passed', () => {
    renderWithBookmarkProviders(<BookmarkListItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    const defaultTestId = 'bookmark-item';
    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
  });
});
