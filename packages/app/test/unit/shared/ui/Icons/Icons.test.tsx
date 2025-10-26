import { render, screen } from '@testing-library/react';

import { CheckIcon, CrossIcon, FolderIcon, GearIcon, GridIcon, HeartIcon, ListIcon } from '@/shared/ui/Icons/Icons';

describe('Icons', () => {
  const allIconsToTest = [
    ['CheckIcon', CheckIcon],
    ['CrossIcon', CrossIcon],
    ['FolderIcon', FolderIcon],
    ['GearIcon', GearIcon],
    ['HeartIcon', HeartIcon],
    ['GridIcon', GridIcon],
    ['ListIcon', ListIcon],
  ];

  it.each(allIconsToTest)('%s: renders small size by default', (_name, Icon) => {
    render(<Icon dataTestId="check-icon" />);
    const icon = screen.getByTestId('check-icon');

    expect(icon).toHaveClass('w-4 h-4');
  });

  it.each(allIconsToTest)('%s: renders extra-large size', (_name, Icon) => {
    render(<Icon dataTestId="check-icon" size="xl" />);
    const icon = screen.getByTestId('check-icon');

    expect(icon).toHaveClass('w-48 h-48');
  });

  it.each(allIconsToTest)('%s: renders large size', (_name, Icon) => {
    render(<Icon dataTestId="check-icon" size="lg" />);
    const icon = screen.getByTestId('check-icon');

    expect(icon).toHaveClass('w-24 h-24');
  });

  it.each(allIconsToTest)('%s: renders medium size', (_name, Icon) => {
    render(<Icon dataTestId="check-icon" size="md" />);
    const icon = screen.getByTestId('check-icon');

    expect(icon).toHaveClass('w-12 h-12');
  });

  it.each(allIconsToTest)('%s: renders small size', (_name, Icon) => {
    render(<Icon dataTestId="check-icon" size="sm" />);
    const icon = screen.getByTestId('check-icon');

    expect(icon).toHaveClass('w-4 h-4');
  });

  it.each(allIconsToTest)('%s: renders extra small size', (_name, Icon) => {
    render(<Icon dataTestId="check-icon" size="xs" />);
    const icon = screen.getByTestId('check-icon');

    expect(icon).toHaveClass('w-3 h-3');
  });

  it.each(allIconsToTest)('%s: renders with default class name', (_name, Icon) => {
    const { getByTestId } = render(<Icon dataTestId="check-icon" />);
    const checkIcon = getByTestId('check-icon');
    expect(checkIcon).toHaveClass('w-4 h-4');
  });

  it.each(allIconsToTest)('%s: renders with custom class name', (_name, Icon) => {
    const { getByTestId } = render(<Icon className="custom-class" dataTestId="check-icon" />);
    const checkIcon = getByTestId('check-icon');
    expect(checkIcon).toHaveClass('w-4 h-4 custom-class');
  });

  it.each(allIconsToTest)('%s: renders with custom size and class name', (_name, Icon) => {
    const { getByTestId } = render(<Icon className="custom-class" dataTestId="check-icon" size="lg" />);
    const checkIcon = getByTestId('check-icon');
    expect(checkIcon).toHaveClass('w-24 h-24 custom-class');
  });
});
