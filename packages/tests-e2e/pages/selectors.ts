/**
 * Centralized selectors for E2E tests
 * All selectors use data-testid attributes for stability
 */

export const selectors = {
  // App containers
  appContainer: '[data-testid="app-container"]',
  appContent: '[data-testid="app-content"]',

  // Bookmarks
  bookmarks: {
    item: '[data-testid^="bookmark-item-"]',
    folderItem: '[data-testid^="bookmark-folder-item-"]',
    contentContainer: '[data-testid^="bookmark-content-container-"]',
    optionsButton: '[data-testid="item-options-button"]',
    deleteConfirmButton: '[data-testid="bookmark-delete-confirm-button"]',
    deleteCancelButton: '[data-testid="bookmark-delete-cancel-button"]',
    editTitleInput: '[data-testid="bookmark-edit-title-input"]',
    formModalCloseButton: '[data-testid="bookmark-form-modal-close-button"]',
    dragHandleButton: '[data-testid="drag-handle-button"]',
  },

  // Sidebar
  sidebar: {
    container: '[data-testid="sidebar"]',
    folderItem: '[data-testid^="sidebar-folder-item-"]',
  },

  // Search
  search: {
    input: '[data-testid="search-input"]',
  },

  // View
  view: {
    toggle: '[data-testid="view-toggle"]',
    gridMode: '[data-view-mode="grid"]',
    listMode: '[data-view-mode="list"]',
    gridIcon: '[data-testid="grid-icon"]',
    listIcon: '[data-testid="list-icon"]',
  },

  // Settings
  settings: {
    toggle: '[data-testid="settings-toggle"]',
    modal: '[data-testid="settings-modal"]',

    // Theme settings
    theme: {
      custom: '[data-testid="theme-custom"]',
      default: '[data-testid="theme-default"]',
      githubLight: '[data-testid="theme-github-light"]',
      githubDark: '[data-testid="theme-github-dark"]',
      solarizedLight: '[data-testid="theme-solarized-light"]',
      solarizedDark: '[data-testid="theme-solarized-dark"]',
      nordLight: '[data-testid="theme-nord-light"]',
      nord: '[data-testid="theme-nord"]',
      vscodeDark: '[data-testid="theme-vscode-dark"]',
      dracula: '[data-testid="theme-dracula"]',
      tokyoNight: '[data-testid="theme-tokyo-night"]',
      catppuccinMocha: '[data-testid="theme-catppuccin-mocha"]',
      pink: '[data-testid="theme-pink"]',
    },
    customThemeStyle: '#custom-theme-style',

    // Background overlay
    backgroundOverlay: {
      settings: '[data-testid="background-overlay-settings"]',
      toggle: '[data-testid="background-overlay-toggle"]',
      option1: '[data-testid="background-overlay-option-1"]',
    },

    // Greeting
    greeting: {
      settings: '[data-testid="greeting-settings"]',
      nameInput: '[data-testid="greeting-name-input"]',
      message: '[data-testid="greeting-message"]',
    },

    // Sidebar
    sidebar: {
      settings: '[data-testid="sidebar-settings"]',
      toggle: '[data-testid="sidebar-settings-toggle"]',
    },

    // Search bar
    searchBar: {
      enabledToggle: '[data-testid="search-bar-enabled-toggle"]',
    },

    // Reset
    reset: {
      confirmButton: '[data-testid="settings-reset-confirm-button"]',
      confirmationModal: '[data-testid="confirmation-modal-container"]',
    },
  },
};

/**
 * Helper function to get selectors with optional formatting
 */
export const getSelector = (path: string): string => {
  const parts = path.split('.');
  let current: any = selectors;

  for (const part of parts) {
    if (current[part] === undefined) {
      throw new Error(`Selector path not found: ${path}`);
    }
    current = current[part];
  }

  return typeof current === 'string' ? current : '';
};
