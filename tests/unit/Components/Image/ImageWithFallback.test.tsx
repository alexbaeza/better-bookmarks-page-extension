import { fireEvent, render, screen } from '@testing-library/react';
import { ImageWithFallback } from '../../../../src/Components/Image/ImageWithFallback';

describe('ImageWithFallback', () => {
  const altText = 'Test Image';
  const originalSrc = 'https://example.com/image.jpg';
  const fallbackSrc = 'data:image/png;base64';

  it('renders the image with original src', () => {
    render(<ImageWithFallback src={originalSrc} alt={altText} />);
    const image = screen.getByAltText(altText);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', originalSrc);
  });

  it('renders the fallback image when the original src fails', () => {
    render(
      <ImageWithFallback
        src="invalid-src"
        fallback={fallbackSrc}
        alt={altText}
      />
    );

    const image = screen.getByAltText(altText);

    // Simulate the error by firing the onError event
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', fallbackSrc);
  });

  it('passes through additional props', () => {
    render(
      <ImageWithFallback
        src={originalSrc}
        alt={altText}
        className="custom-class"
        data-testid="test-image"
      />
    );
    const image = screen.getByTestId('test-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('custom-class');
  });
});
