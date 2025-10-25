import { vi } from 'vitest';

import { BookmarkListItem } from '@/features/bookmarks/components/items/list/BookmarkListItem';
import { renderWithBookmarkProviders, screen } from '~test/test-utils';

describe('BookmarkListItem', () => {
  const title = 'Example Bookmark';
  const url = 'https://www.example.com';

  it('renders the title and favicon correctly', () => {
    renderWithBookmarkProviders(<BookmarkListItem title={title} url={url} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://icons.duckduckgo.com/ip3/example.com.ico');
  });

  it('renders the link with the correct href', () => {
    renderWithBookmarkProviders(<BookmarkListItem title={title} url={url} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', url);
  });

  it('renders with a custom data-testid if passed', () => {
    const customTestId = 'custom-list-item-test-id';
    renderWithBookmarkProviders(<BookmarkListItem title={title} url={url} dataTestId={customTestId} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('renders with a default data-testid if not passed', () => {
    renderWithBookmarkProviders(<BookmarkListItem title={title} url={url} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const defaultTestId = 'bookmark-item';
    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
  });
});
