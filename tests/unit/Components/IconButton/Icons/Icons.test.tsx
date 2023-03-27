import { render, screen } from '@testing-library/react';
import { CheckIcon } from '../../../../../src/Components/IconButton/Icons/Icons';

describe('Icons', () => {
  describe('CheckIcon', () => {
    it('renders small size by default', () => {
      render(<CheckIcon dataTestId="check-icon" />);
      const icon = screen.getByTestId('check-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra-large size', () => {
      render(<CheckIcon dataTestId="check-icon" size="xl" />);
      const icon = screen.getByTestId('check-icon');

      expect(icon).toHaveClass('w-48 h-48');
    });

    it('renders large size', () => {
      render(<CheckIcon dataTestId="check-icon" size="lg" />);
      const icon = screen.getByTestId('check-icon');

      expect(icon).toHaveClass('w-24 h-24');
    });

    it('renders medium size', () => {
      render(<CheckIcon dataTestId="check-icon" size="md" />);
      const icon = screen.getByTestId('check-icon');

      expect(icon).toHaveClass('w-12 h-12');
    });

    it('renders small size', () => {
      render(<CheckIcon dataTestId="check-icon" size="sm" />);
      const icon = screen.getByTestId('check-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders with default class name', () => {
      const { getByTestId } = render(<CheckIcon dataTestId="check-icon" />);
      const checkIcon = getByTestId('check-icon');
      expect(checkIcon).toHaveClass('w-5 h-5');
    });

    it('renders with custom class name', () => {
      const { getByTestId } = render(
        <CheckIcon dataTestId="check-icon" className="custom-class" />
      );
      const checkIcon = getByTestId('check-icon');
      expect(checkIcon).toHaveClass('w-5 h-5 custom-class');
    });

    it('renders with custom size and class name', () => {
      const { getByTestId } = render(
        <CheckIcon dataTestId="check-icon" size="lg" className="custom-class" />
      );
      const checkIcon = getByTestId('check-icon');
      expect(checkIcon).toHaveClass('w-24 h-24 custom-class');
    });
  });
});
