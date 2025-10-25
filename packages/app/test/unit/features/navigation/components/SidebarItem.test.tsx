import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SidebarItem } from '@/features/navigation/sidebar/components/SidebarItem';

describe('SidebarItem', () => {
  it('renders icon, label and badge', () => {
    render(<SidebarItem icon={<span data-testid="icon" />} label="Label" badge={3} onClick={() => {}} />);
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<SidebarItem icon={<span />} label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies selected styles when isSelected', () => {
    render(<SidebarItem icon={<span />} label="Selected" isSelected onClick={() => {}} />);
    expect(screen.getByText('Selected').closest('button')).toHaveClass('bg-fgColor-hover');
  });
});
