import { render, screen } from '@testing-library/react';

import { APP_DONATION_URL } from '@/config/constants';
import { Sponsor } from '@/shared/ui/Sponsor';

describe('Sponsor component', () => {
  it('renders the sponsor comment', () => {
    render(<Sponsor />);
    const comment = screen.getByTestId('sponsor-comment');
    expect(comment).toHaveTextContent(/Free and open-source*/);
  });

  it('renders the sponsor link with the correct URL', () => {
    render(<Sponsor />);
    const link = screen.getByTestId('sponsor-link');
    expect(link).toHaveAttribute('href', APP_DONATION_URL);
  });

  it('renders the sponsor link image with the correct alt text and image', () => {
    render(<Sponsor />);
    const image = screen.getByTestId('sponsor-link-image');
    expect(image).toHaveAttribute('alt', 'Buy me a coffee');
    expect(image).toHaveAttribute('src', 'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png');
  });
});
