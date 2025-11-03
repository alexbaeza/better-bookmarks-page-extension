import { describe, expect, it } from 'vitest';

import { initialAppState } from '@/app/providers/app-state';

describe('initialAppState', () => {
  it('has correct initial values', () => {
    expect(initialAppState).toStrictEqual({
      bookmarks: { folders: [], uncategorized: undefined },
      currentPage: 'All',
      filteredData: [],
      isLoading: false,
      providerInitialised: false,
    });
  });

  it('has all required properties', () => {
    expect(initialAppState).toHaveProperty('currentPage');
    expect(initialAppState).toHaveProperty('providerInitialised');
    expect(initialAppState).toHaveProperty('bookmarks');
    expect(initialAppState).toHaveProperty('filteredData');
    expect(initialAppState).toHaveProperty('isLoading');
  });

  it('has empty bookmarks structure', () => {
    expect(initialAppState.bookmarks).toStrictEqual({
      folders: [],
      uncategorized: undefined,
    });
  });

  it('has empty filtered data', () => {
    expect(initialAppState.filteredData).toStrictEqual([]);
  });

  it('initializes with currentPage as All', () => {
    expect(initialAppState.currentPage).toBe('All');
  });

  it('initializes with providerInitialised as false', () => {
    expect(initialAppState.providerInitialised).toBe(false);
  });

  it('initializes with isLoading as false', () => {
    expect(initialAppState.isLoading).toBe(false);
  });
});
