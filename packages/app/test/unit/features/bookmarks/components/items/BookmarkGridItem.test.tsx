import { vi } from 'vitest';

import { BookmarkGridItem } from '@/features/bookmarks/components/items/grid/BookmarkGridItem';
import { act, renderWithBookmarkProviders, screen } from '~test/test-utils';

describe('BookmarkGridItem', () => {
  const title = 'Example Bookmark';
  const url = 'https://www.example.com';

  it('renders the title and favicon correctly', () => {
    renderWithBookmarkProviders(<BookmarkGridItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByAltText('Example Bookmark')).toBeInTheDocument();
  });

  it('renders as a clickable button for bookmarks', () => {
    renderWithBookmarkProviders(<BookmarkGridItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    const button = screen.getByTestId('grid-item-main-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('role', 'button');
  });

  it('renders with a custom data-testid if passed', () => {
    const customTestId = 'custom-grid-item-test-id';
    renderWithBookmarkProviders(<BookmarkGridItem dataTestId={customTestId} onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('renders with a default data-testid if not passed', () => {
    renderWithBookmarkProviders(<BookmarkGridItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    const defaultTestId = 'grid-item';
    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
  });

  it('uses fallback favicon when image errors', async () => {
    renderWithBookmarkProviders(<BookmarkGridItem onDelete={vi.fn()} onEdit={vi.fn()} title={title} url={url} />);
    const img = screen.getByAltText('Example Bookmark') as HTMLImageElement;
    await act(async () => {
      img.dispatchEvent(new Event('error', { bubbles: true }));
    });
    expect(img.src).toContain('data:image/png');
  });
});
