/**
 * Shared type utilities for tests
 * Provides proper types for test environment global objects and mocks
 */

/**
 * Extended Window type for tests that includes browser APIs
 */
export type TestWindow = typeof window & {
  chrome?: {
    bookmarks?: unknown;
    runtime?: { id?: string };
    notifications?: { create: unknown };
  };
  browser?: {
    bookmarks?: unknown;
    runtime?: { id?: string };
    notifications?: { create: unknown };
  };
};

/**
 * Extended globalThis type for tests that includes browser APIs and Cypress
 */
export type TestGlobalThis = typeof globalThis & {
  Cypress?: unknown;
  chrome?: {
    bookmarks?: unknown;
    runtime?: { id?: string };
  };
  browser?: {
    bookmarks?: unknown;
    runtime?: { id?: string };
  };
};

/**
 * Extended Global type for tests (Node.js environment)
 */
export type TestGlobal = typeof global & {
  ResizeObserver?: typeof ResizeObserver;
};
