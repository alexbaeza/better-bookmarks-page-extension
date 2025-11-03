import type { AppState } from '@/app/providers/app-state';
import { type AppStateAction, appStateReducer } from '@/app/providers/app-state-reducer';
import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';

describe('appStateReducer', () => {
  const initialState: AppState = {
    bookmarks: { folders: [], uncategorized: [] },
    error: undefined,
    isLoading: false,
    providerInitialised: false,
  };

  const mockBookmarksData: BookmarksData = {
    folders: [{ children: [], id: '1', title: 'Test Folder' }],
    uncategorized: [],
  };

  it('handles PROVIDER_INITIALISED action', () => {
    const action: AppStateAction = { type: 'PROVIDER_INITIALISED' };
    const result = appStateReducer(initialState, action);

    expect(result).toStrictEqual({
      ...initialState,
      providerInitialised: true,
    });
  });

  it('handles LOAD_BOOKMARKS_DATA_START action', () => {
    const action: AppStateAction = { type: 'LOAD_BOOKMARKS_DATA_START' };
    const result = appStateReducer(initialState, action);

    expect(result).toStrictEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('handles LOAD_BOOKMARKS_DATA_SUCCESS action', () => {
    const action: AppStateAction = {
      data: mockBookmarksData,
      type: 'LOAD_BOOKMARKS_DATA_SUCCESS',
    };
    const result = appStateReducer(initialState, action);

    expect(result).toStrictEqual({
      ...initialState,
      bookmarks: mockBookmarksData,
    });
  });

  it('handles LOAD_BOOKMARKS_DATA_FINISHED action', () => {
    const stateWithLoading: AppState = {
      ...initialState,
      isLoading: true,
    };
    const action: AppStateAction = { type: 'LOAD_BOOKMARKS_DATA_FINISHED' };
    const result = appStateReducer(stateWithLoading, action);

    expect(result).toStrictEqual({
      ...stateWithLoading,
      isLoading: false,
    });
  });

  it('handles ERROR action', () => {
    const error = new Error('Test error');
    const action: AppStateAction = { error, type: 'ERROR' };
    const result = appStateReducer(initialState, action);

    expect(result).toStrictEqual({
      ...initialState,
      error,
    });
  });

  it('returns unchanged state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as AppStateAction;
    const result = appStateReducer(initialState, unknownAction);

    expect(result).toBe(initialState);
  });

  it('preserves other state properties when updating specific fields', () => {
    const stateWithError: AppState = {
      ...initialState,
      error: new Error('Previous error'),
      providerInitialised: true,
    };

    const action: AppStateAction = { type: 'LOAD_BOOKMARKS_DATA_START' };
    const result = appStateReducer(stateWithError, action);

    expect(result).toStrictEqual({
      ...stateWithError,
      isLoading: true,
    });
    expect(result.error).toBe(stateWithError.error);
    expect(result.providerInitialised).toBe(stateWithError.providerInitialised);
  });

  it('handles multiple state changes correctly', () => {
    let state = initialState;

    state = appStateReducer(state, { type: 'LOAD_BOOKMARKS_DATA_START' });
    expect(state.isLoading).toBe(true);

    state = appStateReducer(state, { type: 'PROVIDER_INITIALISED' });
    expect(state.providerInitialised).toBe(true);
    expect(state.isLoading).toBe(true); // Should still be loading

    state = appStateReducer(state, {
      data: mockBookmarksData,
      type: 'LOAD_BOOKMARKS_DATA_SUCCESS',
    });
    expect(state.bookmarks).toStrictEqual(mockBookmarksData);
    expect(state.isLoading).toBe(true); // Should still be loading

    state = appStateReducer(state, { type: 'LOAD_BOOKMARKS_DATA_FINISHED' });
    expect(state.isLoading).toBe(false);
    expect(state.providerInitialised).toBe(true);
    expect(state.bookmarks).toStrictEqual(mockBookmarksData);
  });
});
