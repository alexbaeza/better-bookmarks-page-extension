import { render, screen } from '@testing-library/react';

import { Sponsor } from '@/shared/ui/Sponsor';

describe('Sponsor component', () => {
  it('renders the sponsor comment', () => {
    render(<Sponsor />);
    const comment = screen.getByTestId('sponsor-comment');
    expect(comment).toHaveTextContent(/This app was built with the intentions of it being free to the public as well as open-sourced*/);
  });

  it('renders the sponsor link with the correct URL', () => {
    render(<Sponsor />);
    const link = screen.getByTestId('sponsor-link');
    expect(link).toHaveAttribute('href', 'https://www.buymeacoffee.com/alexbaeza');
  });

  it('renders the sponsor link image with the correct alt text and image', () => {
    render(<Sponsor />);
    const image = screen.getByTestId('sponsor-link-image');
    expect(image).toHaveAttribute('alt', 'Buy me a coffee');
    expect(image).toHaveAttribute('src', 'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png');
  });
});
