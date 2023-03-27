// Footer Component
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../../../src/Components/Footer/Footer';

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
    expect(authorLink).toHaveAttribute(
      'href',
      'https://github.com/alexbaeza/better-bookmarks-page-extension'
    );
  });
});
