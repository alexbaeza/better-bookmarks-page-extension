import { render, screen } from '@testing-library/react';

import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';

describe('NotFoundIllustration', () => {
  it('renders the not found illustration with default props', () => {
    render(<NotFoundIllustration />);

    const image = screen.getByAltText('Page not found illustration');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image).toHaveClass('mb-6', 'opacity-20');
  });

  it('renders with custom className', () => {
    render(<NotFoundIllustration className="custom-class" />);

    const image = screen.getByAltText('Page not found illustration');
    expect(image).toHaveClass('mb-6', 'opacity-20', 'custom-class');
  });

  it('renders with empty className', () => {
    render(<NotFoundIllustration className="" />);

    const image = screen.getByAltText('Page not found illustration');
    expect(image).toHaveClass('mb-6', 'opacity-20');
  });
});
