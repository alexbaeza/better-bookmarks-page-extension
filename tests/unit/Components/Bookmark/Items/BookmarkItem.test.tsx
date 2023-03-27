import React from 'react';
import { render, screen } from '@testing-library/react';
import { BookmarkItem } from '../../../../../src/Components/Bookmark/Items/BookmarkItem';

describe('BookmarkItem', () => {
  const title = 'Test Bookmark';
  const url = 'https://www.example.com';

  it('renders the title and URL props correctly', () => {
    render(<BookmarkItem title={title} url={url} />);

    const image = screen.getByTestId('image-with-fallback');
    expect(image).toHaveAttribute(
      'src',
      'https://puny-yellow-llama.faviconkit.com/example.com/256'
    );
    expect(image).toHaveAttribute('alt', `Bookmark item for ${title}`);
  });

  it('renders the ImageWithFallback component', () => {
    render(<BookmarkItem title={title} url={url} />);
    expect(screen.getByTestId('image-with-fallback')).toBeInTheDocument();
  });

  it('renders a link with the correct URL', () => {
    render(<BookmarkItem title={title} url={url} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', url);
  });
});
