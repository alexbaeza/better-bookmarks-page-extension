import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

import { Menu } from '@/features/bookmarks/components/items/options/Menu';

describe('Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const portalRoot = document.createElement('div');
    portalRoot.id = 'bookmark-menu-portal';
    document.body.appendChild(portalRoot);

    Element.prototype.getBoundingClientRect = vi.fn(
      () =>
        ({
          bottom: 100,
          right: 100,
          width: 50,
          height: 50,
          top: 50,
          left: 50,
          x: 50,
          y: 50,
          toJSON: () => ({}),
        }) as DOMRect
    );

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { value: 160 });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { value: 100 });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders children in portal', () => {
    const anchorRef = { current: document.createElement('button') };
    const onClose = vi.fn();

    render(
      <Menu anchorRef={anchorRef} onClose={onClose}>
        <div>Test Menu Item</div>
      </Menu>
    );

    expect(screen.getByText('Test Menu Item')).toBeInTheDocument();
  });

  it('calls onClose when clicking outside', async () => {
    const anchorRef = { current: document.createElement('button') };
    const onClose = vi.fn();

    render(
      <Menu anchorRef={anchorRef} onClose={onClose}>
        <div>Test Menu Item</div>
      </Menu>
    );

    expect(screen.getByText('Test Menu Item')).toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const outsideElement = document.createElement('div');
    outsideElement.setAttribute('data-testid', 'outside-element');
    document.body.appendChild(outsideElement);

    act(() => {
      fireEvent.mouseDown(outsideElement);
    });

    expect(onClose).toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });

  it('calls onMouseEnter and onMouseLeave', () => {
    const anchorRef = { current: document.createElement('button') };
    const onClose = vi.fn();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    render(
      <Menu anchorRef={anchorRef} onClose={onClose} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div>Test Menu Item</div>
      </Menu>
    );

    const menu = screen.getByText('Test Menu Item').parentElement;
    expect(menu).toBeTruthy();
    fireEvent.mouseEnter(menu as HTMLElement);
    fireEvent.mouseLeave(menu as HTMLElement);

    expect(onMouseEnter).toHaveBeenCalled();
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('does not render if portal root not found', () => {
    document.body.innerHTML = '';
    const anchorRef = { current: document.createElement('button') };
    const onClose = vi.fn();

    render(
      <Menu anchorRef={anchorRef} onClose={onClose}>
        <div>Test Menu Item</div>
      </Menu>
    );

    expect(screen.queryByText('Test Menu Item')).not.toBeInTheDocument();
  });
});
