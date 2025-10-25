import { render, screen } from '@testing-library/react';

import { BuiltWith } from '@/shared/ui/BuiltWith';

describe('BuiltWith', () => {
  it('renders the built with message', () => {
    render(<BuiltWith />);
    expect(screen.getByTestId('built-with')).toBeInTheDocument();
  });

  it('renders the heart icon', () => {
    render(<BuiltWith />);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders the author link', () => {
    render(<BuiltWith />);
    const authorLink = screen.getByRole('link');
    expect(authorLink).toBeInTheDocument();
    // Repo URL comes from constants; ensure it is present
    expect(authorLink?.getAttribute('href')).toMatch('github.com/alexbaeza/better-bookmarks-page-extension');
  });
});
