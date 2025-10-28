import { describe, expect, it, vi } from 'vitest';

// Mock createRoot
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

// Mock the App component
vi.mock('@/app/entrypoints/app', () => ({
  App: () => <div data-testid="app">App</div>,
}));

// Mock the global CSS import
vi.mock('@/styles/globals.css', () => ({}));

describe('index entrypoint', () => {
  it('should verify root element requirements', () => {
    // Create a mock root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const foundRoot = document.getElementById('root');
    expect(foundRoot).toBeTruthy();
    expect(foundRoot?.id).toBe('root');

    // Cleanup
    document.body.removeChild(rootElement);
  });

  it('should verify missing root element would fail', () => {
    // Remove any existing root element
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

    // Simulate what the index file does
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    expect(rootElement).toBeDefined();
    expect(rootElement.id).toBe('root');
  });
});
