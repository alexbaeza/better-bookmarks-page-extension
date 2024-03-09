import { render, screen } from '@testing-library/react';
import { BookmarkGridItem } from '../../../../../src/Components/Bookmark/Items/BookmarkGridItem';

describe('BookmarkGridItem', () => {
  const title = 'Example Bookmark';
  const url = 'https://www.example.com';

  it('renders the title and favicon correctly', () => {
    render(<BookmarkGridItem title={title} url={url} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByTestId('image-with-fallback')).toHaveAttribute(
      'src',
      `https://icons.duckduckgo.com/ip3/example.com.ico`
    );
  });

  it('renders the link with the correct href', () => {
    render(<BookmarkGridItem title={title} url={url} />);
    const link = screen.getByTestId('bookmark-grid-item');
    expect(link).toHaveAttribute('href', url);
  });

  it('renders with a custom data-testid if passed', () => {
    const customTestId = 'custom-grid-item-test-id';
    render(
      <BookmarkGridItem title={title} url={url} dataTestId={customTestId} />
    );
    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('renders with a default data-testid if not passed', () => {
    render(<BookmarkGridItem title={title} url={url} />);
    const defaultTestId = 'bookmark-grid-item';
    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();
  });
});
