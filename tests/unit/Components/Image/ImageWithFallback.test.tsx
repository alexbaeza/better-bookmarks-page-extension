import { render, screen } from '@testing-library/react';
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

  //FIXME: Unable to tests onErrorMock
  it.skip('renders the fallback image when the original src fails', () => {
    const onErrorMock = jest.fn();
    render(
      <ImageWithFallback
        src="invalid-src"
        fallback={fallbackSrc}
        alt={altText}
        onError={onErrorMock}
      />
    );
    const image = screen.getByAltText(altText);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', fallbackSrc);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
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
