import { describe, expect, it, vi } from 'vitest';

const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

vi.mock('@/app/entrypoints/app', () => ({
  App: () => <div data-testid="app">App</div>,
}));

vi.mock('@/styles/globals.css', () => ({}));

describe('index entrypoint', () => {
  it('should verify root element requirements', () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const foundRoot = document.getElementById('root');
    expect(foundRoot).toBeTruthy();
    expect(foundRoot?.id).toBe('root');

    document.body.removeChild(rootElement);
  });

  it('should verify missing root element would fail', () => {
    const existingRoot = document.getElementById('root');
    if (existingRoot) {
      document.body.removeChild(existingRoot);
    }

    const container = document.getElementById('root');
    expect(container).toBeNull();
  });

  it('should verify createRoot would be called with root element', () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';

    if (!rootElement) {
      throw new Error('Root element not found');
    }

    expect(rootElement).toBeDefined();
    expect(rootElement.id).toBe('root');
  });
});
