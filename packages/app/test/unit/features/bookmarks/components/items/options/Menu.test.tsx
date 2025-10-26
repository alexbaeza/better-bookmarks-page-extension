import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

import { Menu } from '@/features/bookmarks/components/items/options/Menu';

describe('Menu', () => {
  beforeEach(() => {
    if (!document.getElementById('bookmark-menu-portal')) {
      const portal = document.createElement('div');
      portal.setAttribute('id', 'bookmark-menu-portal');
      document.body.appendChild(portal);
    }
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

    await act(() => {
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
    expect(menu).not.toBeNull();
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

  it('calls onClose when escape key is pressed', () => {
    const anchorRef = { current: document.createElement('button') };
    const onClose = vi.fn();

    render(
      <Menu anchorRef={anchorRef} onClose={onClose}>
        <div>Test Menu Item</div>
      </Menu>
    );

    expect(screen.getByText('Test Menu Item')).toBeInTheDocument();

    fireEvent.keyDown(document, { code: 'Escape', key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});
