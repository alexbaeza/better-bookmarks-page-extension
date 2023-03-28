import { render, screen } from '@testing-library/react';
import {
  CheckIcon,
  CrossIcon,
  FolderIcon,
  GearIcon,
  HeartIcon
} from '../../../../../src/Components/IconButton/Icons/Icons';

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

    it('renders extra small size', () => {
      render(<CheckIcon dataTestId="check-icon" size="xs" />);
      const icon = screen.getByTestId('check-icon');

      expect(icon).toHaveClass('w-3 h-3');
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

  describe('CrossIcon', () => {
    it('renders small size by default', () => {
      render(<CrossIcon dataTestId="cross-icon" />);
      const icon = screen.getByTestId('cross-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra-large size', () => {
      render(<CrossIcon dataTestId="cross-icon" size="xl" />);
      const icon = screen.getByTestId('cross-icon');

      expect(icon).toHaveClass('w-48 h-48');
    });

    it('renders large size', () => {
      render(<CrossIcon dataTestId="cross-icon" size="lg" />);
      const icon = screen.getByTestId('cross-icon');

      expect(icon).toHaveClass('w-24 h-24');
    });

    it('renders medium size', () => {
      render(<CrossIcon dataTestId="cross-icon" size="md" />);
      const icon = screen.getByTestId('cross-icon');

      expect(icon).toHaveClass('w-12 h-12');
    });

    it('renders small size', () => {
      render(<CrossIcon dataTestId="cross-icon" size="sm" />);
      const icon = screen.getByTestId('cross-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra small size', () => {
      render(<CrossIcon dataTestId="cross-icon" size="xs" />);
      const icon = screen.getByTestId('cross-icon');

      expect(icon).toHaveClass('w-3 h-3');
    });

    it('renders with default class name', () => {
      const { getByTestId } = render(<CrossIcon dataTestId="cross-icon" />);
      const checkIcon = getByTestId('cross-icon');
      expect(checkIcon).toHaveClass('w-5 h-5');
    });

    it('renders with custom class name', () => {
      const { getByTestId } = render(
        <CrossIcon dataTestId="cross-icon" className="custom-class" />
      );
      const checkIcon = getByTestId('cross-icon');
      expect(checkIcon).toHaveClass('w-5 h-5 custom-class');
    });

    it('renders with custom size and class name', () => {
      const { getByTestId } = render(
        <CrossIcon dataTestId="cross-icon" size="lg" className="custom-class" />
      );
      const checkIcon = getByTestId('cross-icon');
      expect(checkIcon).toHaveClass('w-24 h-24 custom-class');
    });
  });

  describe('FolderIcon', () => {
    it('renders small size by default', () => {
      render(<FolderIcon dataTestId="folder-icon" />);
      const icon = screen.getByTestId('folder-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra-large size', () => {
      render(<FolderIcon dataTestId="folder-icon" size="xl" />);
      const icon = screen.getByTestId('folder-icon');

      expect(icon).toHaveClass('w-48 h-48');
    });

    it('renders large size', () => {
      render(<FolderIcon dataTestId="folder-icon" size="lg" />);
      const icon = screen.getByTestId('folder-icon');

      expect(icon).toHaveClass('w-24 h-24');
    });

    it('renders medium size', () => {
      render(<FolderIcon dataTestId="folder-icon" size="md" />);
      const icon = screen.getByTestId('folder-icon');

      expect(icon).toHaveClass('w-12 h-12');
    });

    it('renders small size', () => {
      render(<FolderIcon dataTestId="folder-icon" size="sm" />);
      const icon = screen.getByTestId('folder-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra small size', () => {
      render(<FolderIcon dataTestId="folder-icon" size="xs" />);
      const icon = screen.getByTestId('folder-icon');

      expect(icon).toHaveClass('w-3 h-3');
    });

    it('renders with default class name', () => {
      const { getByTestId } = render(<FolderIcon dataTestId="folder-icon" />);
      const checkIcon = getByTestId('folder-icon');
      expect(checkIcon).toHaveClass('w-5 h-5');
    });

    it('renders with custom class name', () => {
      const { getByTestId } = render(
        <FolderIcon dataTestId="folder-icon" className="custom-class" />
      );
      const checkIcon = getByTestId('folder-icon');
      expect(checkIcon).toHaveClass('w-5 h-5 custom-class');
    });

    it('renders with custom size and class name', () => {
      const { getByTestId } = render(
        <FolderIcon
          dataTestId="folder-icon"
          size="lg"
          className="custom-class"
        />
      );
      const checkIcon = getByTestId('folder-icon');
      expect(checkIcon).toHaveClass('w-24 h-24 custom-class');
    });
  });

  describe('GearIcon', () => {
    it('renders small size by default', () => {
      render(<GearIcon dataTestId="gear-icon" />);
      const icon = screen.getByTestId('gear-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra-large size', () => {
      render(<GearIcon dataTestId="gear-icon" size="xl" />);
      const icon = screen.getByTestId('gear-icon');

      expect(icon).toHaveClass('w-48 h-48');
    });

    it('renders large size', () => {
      render(<GearIcon dataTestId="gear-icon" size="lg" />);
      const icon = screen.getByTestId('gear-icon');

      expect(icon).toHaveClass('w-24 h-24');
    });

    it('renders medium size', () => {
      render(<GearIcon dataTestId="gear-icon" size="md" />);
      const icon = screen.getByTestId('gear-icon');

      expect(icon).toHaveClass('w-12 h-12');
    });

    it('renders small size', () => {
      render(<GearIcon dataTestId="gear-icon" size="sm" />);
      const icon = screen.getByTestId('gear-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra small size', () => {
      render(<GearIcon dataTestId="gear-icon" size="xs" />);
      const icon = screen.getByTestId('gear-icon');

      expect(icon).toHaveClass('w-3 h-3');
    });

    it('renders with default class name', () => {
      const { getByTestId } = render(<GearIcon dataTestId="gear-icon" />);
      const checkIcon = getByTestId('gear-icon');
      expect(checkIcon).toHaveClass('w-5 h-5');
    });

    it('renders with custom class name', () => {
      const { getByTestId } = render(
        <GearIcon dataTestId="gear-icon" className="custom-class" />
      );
      const checkIcon = getByTestId('gear-icon');
      expect(checkIcon).toHaveClass('w-5 h-5 custom-class');
    });

    it('renders with custom size and class name', () => {
      const { getByTestId } = render(
        <GearIcon dataTestId="gear-icon" size="lg" className="custom-class" />
      );
      const checkIcon = getByTestId('gear-icon');
      expect(checkIcon).toHaveClass('w-24 h-24 custom-class');
    });
  });

  describe('HeartIcon', () => {
    it('renders small size by default', () => {
      render(<HeartIcon dataTestId="heart-icon" />);
      const icon = screen.getByTestId('heart-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra-large size', () => {
      render(<HeartIcon dataTestId="heart-icon" size="xl" />);
      const icon = screen.getByTestId('heart-icon');

      expect(icon).toHaveClass('w-48 h-48');
    });

    it('renders large size', () => {
      render(<HeartIcon dataTestId="heart-icon" size="lg" />);
      const icon = screen.getByTestId('heart-icon');

      expect(icon).toHaveClass('w-24 h-24');
    });

    it('renders medium size', () => {
      render(<HeartIcon dataTestId="heart-icon" size="md" />);
      const icon = screen.getByTestId('heart-icon');

      expect(icon).toHaveClass('w-12 h-12');
    });

    it('renders small size', () => {
      render(<HeartIcon dataTestId="heart-icon" size="sm" />);
      const icon = screen.getByTestId('heart-icon');

      expect(icon).toHaveClass('w-5 h-5');
    });

    it('renders extra small size', () => {
      render(<HeartIcon dataTestId="heart-icon" size="xs" />);
      const icon = screen.getByTestId('heart-icon');

      expect(icon).toHaveClass('w-3 h-3');
    });

    it('renders with default class name', () => {
      const { getByTestId } = render(<HeartIcon dataTestId="heart-icon" />);
      const checkIcon = getByTestId('heart-icon');
      expect(checkIcon).toHaveClass('w-5 h-5');
    });

    it('renders with custom class name', () => {
      const { getByTestId } = render(
        <HeartIcon dataTestId="heart-icon" className="custom-class" />
      );
      const checkIcon = getByTestId('heart-icon');
      expect(checkIcon).toHaveClass('w-5 h-5 custom-class');
    });

    it('renders with custom size and class name', () => {
      const { getByTestId } = render(
        <HeartIcon dataTestId="heart-icon" size="lg" className="custom-class" />
      );
      const checkIcon = getByTestId('heart-icon');
      expect(checkIcon).toHaveClass('w-24 h-24 custom-class');
    });
  });
});
