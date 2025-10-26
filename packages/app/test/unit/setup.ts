import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { server } from './mocks/server';
import './mocks/modules';

const originalConsoleError = console.error;

beforeAll(() => {
  // Suppress console.error for error boundary warnings
  console.error = vi.fn();
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  // Restore console.error
  console.error = originalConsoleError;
  server.close();
});

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.appendChild(modalRoot);

const bookmarkMenuPortal = document.createElement('div');
bookmarkMenuPortal.setAttribute('id', 'bookmark-menu-portal');
document.body.appendChild(bookmarkMenuPortal);
