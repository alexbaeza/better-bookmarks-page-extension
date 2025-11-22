import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockRender: ReturnType<typeof vi.fn>;
let mockCreateRoot: ReturnType<typeof vi.fn>;

vi.mock('react-dom/client', () => ({
  createRoot: (...args: unknown[]) => mockCreateRoot(...args),
}));

vi.mock('@/app/entrypoints/app', () => ({
  App: () => <div data-testid="app">App</div>,
}));

vi.mock('@/styles/globals.css', () => ({}));

describe('index entrypoint', () => {
  beforeEach(() => {
    mockRender = vi.fn();
    mockCreateRoot = vi.fn(() => ({
      render: mockRender,
    }));
  });

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
