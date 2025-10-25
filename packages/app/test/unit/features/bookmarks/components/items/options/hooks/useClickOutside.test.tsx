import type React from 'react';
import { useRef } from 'react';
import { vi } from 'vitest';

import { useClickOutside } from '@/features/bookmarks/components/items/options/hooks/useClickOutside';
import { fireEvent, render, screen } from '~test/test-utils';

const TestComponent: React.FC<{ onOutsideClick: () => void }> = ({ onOutsideClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutsideClick);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        Inside
      </div>
      <div data-testid="outside">Outside</div>
    </div>
  );
};

describe('useClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const onOutsideClick = vi.fn();

    render(<TestComponent onOutsideClick={onOutsideClick} />);

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    expect(onOutsideClick).toHaveBeenCalled();
  });

  it('does not call handler when clicking inside', () => {
    const onOutsideClick = vi.fn();

    render(<TestComponent onOutsideClick={onOutsideClick} />);

    const inside = screen.getByTestId('inside');
    fireEvent.mouseDown(inside);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('calls handler on Escape key', () => {
    const onOutsideClick = vi.fn();

    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onOutsideClick).toHaveBeenCalled();
  });

  it('does not call handler on other keys', () => {
    const onOutsideClick = vi.fn();

    render(<TestComponent onOutsideClick={onOutsideClick} />);

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onOutsideClick).not.toHaveBeenCalled();
  });
});
