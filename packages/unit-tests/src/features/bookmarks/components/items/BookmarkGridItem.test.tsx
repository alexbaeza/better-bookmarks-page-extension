import { vi } from 'vitest';

import { BookmarkGridItem } from '@/features/bookmarks/components/items/grid/BookmarkGridItem';
import { renderWithBookmarkProviders, screen } from '~test/test-utils';

describe('BookmarkGridItem', () => {
  const title = 'Example Bookmark';
  const url = 'https://www.example.com';

  it('renders the title and favicon correctly', () => {
    renderWithBookmarkProviders(<BookmarkGridItem title={title} url={url} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://icons.duckduckgo.com/ip3/example.com.ico');
  });

  it('renders as a clickable button for bookmarks', () => {
    renderWithBookmarkProviders(<BookmarkGridItem title={title} url={url} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const button = screen.getByRole('button', { name: /example bookmark/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('role', 'button');
  });

  it('renders with a custom data-testid if passed', () => {
    const customTestId = 'custom-grid-item-test-id';
    renderWithBookmarkProviders(<BookmarkGridItem title={title} url={url} dataTestId={customTestId} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('renders with a default data-testid if not passed', () => {
    renderWithBookmarkProviders(<BookmarkGridItem title={title} url={url} onEdit={vi.fn()} onDelete={vi.fn()} />);
    const defaultTestId = 'grid-item';
    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
  });
});
