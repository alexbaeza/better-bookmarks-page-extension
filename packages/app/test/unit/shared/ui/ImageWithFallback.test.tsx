import { fireEvent, render, screen } from '@testing-library/react';

import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

describe('ImageWithFallback', () => {
  const altText = 'Test Image';
  const originalSrc = 'https://example.com/image.jpg';
  const fallbackSrc = 'data:image/png;base64';

  it('renders the image with original src', () => {
    render(<ImageWithFallback alt={altText} src={originalSrc} />);
    const image = screen.getByAltText(altText);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', originalSrc);
  });

  it('renders the fallback image when the original src fails', () => {
    render(<ImageWithFallback alt={altText} fallback={fallbackSrc} src="invalid-src" />);

    const image = screen.getByAltText(altText);

    fireEvent.error(image);

    expect(image).toHaveAttribute('src', fallbackSrc);
  });

  it('passes through additional props', () => {
    render(<ImageWithFallback alt={altText} className="custom-class" data-testid="test-image" src={originalSrc} />);
    const image = screen.getByTestId('test-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('custom-class');
  });

  it('handles image load event', () => {
    render(<ImageWithFallback alt={altText} src={originalSrc} />);
    const image = screen.getByAltText(altText);

    fireEvent.load(image);

    expect(image).toHaveClass('opacity-100');
  });

  it('shows loading state initially', () => {
    render(<ImageWithFallback alt={altText} src={originalSrc} />);
    const image = screen.getByAltText(altText);

    expect(image).toHaveClass('opacity-50');
  });
});
