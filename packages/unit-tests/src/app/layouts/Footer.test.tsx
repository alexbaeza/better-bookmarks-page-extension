import { render, screen } from '@testing-library/react';

import { Footer } from '@/app/layouts/Footer';

describe('Footer', () => {
  it('renders the built with message', () => {
    render(<Footer />);
    expect(screen.getByTestId('built-with')).toBeInTheDocument();
  });

  it('renders the heart icon', () => {
    render(<Footer />);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders the author link', () => {
    render(<Footer />);
    const authorLink = screen.getByRole('link');
    expect(authorLink).toBeInTheDocument();
    // Repo URL comes from constants; ensure it is present
    expect(authorLink?.getAttribute('href')).toMatch('github.com/alexbaeza/better-bookmarks-page-extension');
  });
});
