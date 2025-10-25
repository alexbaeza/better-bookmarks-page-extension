/// <reference types="cypress" />

// Custom commands for bookmark testing
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Navigate to the bookmark extension
       */
      visitBookmarkExtension(): Chainable<void>;

      /**
       * Wait for bookmarks to load
       */
      waitForBookmarks(): Chainable<void>;

      /**
       * Get bookmark count
       */
      getBookmarkCount(): Chainable<number>;

      /**
       * Get folder count
       */
      getFolderCount(): Chainable<number>;

      /**
       * Drag bookmark to folder
       */
      dragBookmarkToFolder(bookmarkTitle: string, folderTitle: string): Chainable<void>;

      /**
       * Toggle view mode
       */
      toggleViewMode(): Chainable<void>;

      /**
       * Open settings
       */
      openSettings(): Chainable<void>;

      /**
       * Close settings
       */
      closeSettings(): Chainable<void>;

      /**
       * Search for bookmark
       */
      searchBookmark(searchTerm: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitBookmarkExtension', () => {
  cy.visit('/');
  cy.get('[data-testid="container"]').should('be.visible');
});

Cypress.Commands.add('waitForBookmarks', () => {
  cy.get('[data-testid="content"]').should('be.visible');
  cy.wait(1000); // Allow time for bookmarks to load
});

Cypress.Commands.add('getBookmarkCount', () => {
  return cy.get('[data-testid^="bookmark-item-"]').its('length');
});

Cypress.Commands.add('getFolderCount', () => {
  return cy.get('[data-testid^="bookmark-folder-item-"]').its('length');
});

Cypress.Commands.add('dragBookmarkToFolder', (bookmarkTitle: string, folderTitle: string) => {
  cy.get(`[data-testid^="bookmark-item-"]:contains("${bookmarkTitle}")`).trigger('mousedown', { which: 1 });

  cy.get(`[data-testid^="bookmark-folder-item-"]:contains("${folderTitle}")`).trigger('mousemove').trigger('mouseup');

  cy.wait(1000); // Allow drag operation to complete
});

Cypress.Commands.add('toggleViewMode', () => {
  cy.get('[data-testid="view-toggle"]').click();
  cy.wait(500);
});

Cypress.Commands.add('openSettings', () => {
  cy.get('[data-testid="settings-toggle"]').click();
  cy.wait(500);
});

Cypress.Commands.add('closeSettings', () => {
  cy.get('[data-testid="modal-close-button"]').click();
  cy.wait(500);
});

Cypress.Commands.add('searchBookmark', (searchTerm: string) => {
  cy.get('[data-testid="search-input"]').type(searchTerm);
  cy.wait(500);
});

export {};
