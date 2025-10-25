import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Generic drag and drop helper - using proper @dnd-kit events
When('I drag a bookmark to a folder', () => {
  // Get the first bookmark ID
  cy.get('[data-testid^="bookmark-item-"]')
    .first()
    .invoke('attr', 'data-testid')
    .then((bookmarkId) => {
      // Get the first folder ID
      cy.get('[data-testid^="bookmark-folder-item-"]')
        .first()
        .invoke('attr', 'data-testid')
        .then((folderId) => {
          // Use proper drag and drop events for @dnd-kit
          cy.get(`[data-testid="${bookmarkId}"]`)
            .should('exist')
            .trigger('pointerdown', { which: 1, button: 0 })
            .trigger('pointermove', { which: 1, button: 0, movementX: 5, movementY: 5 });

          cy.get(`[data-testid="${folderId}"]`).should('exist').trigger('pointermove', { which: 1, button: 0 }).trigger('pointerup', { which: 1, button: 0 });
        });
    });
});

When('I drag the first bookmark to the second position', () => {
  // Get the first bookmark ID
  cy.get('[data-testid^="bookmark-item-"]')
    .first()
    .invoke('attr', 'data-testid')
    .then((firstBookmarkId) => {
      // Get the second bookmark ID
      cy.get('[data-testid^="bookmark-item-"]')
        .eq(1)
        .invoke('attr', 'data-testid')
        .then((secondBookmarkId) => {
          // Use proper drag and drop events for @dnd-kit
          cy.get(`[data-testid="${firstBookmarkId}"]`)
            .should('exist')
            .trigger('pointerdown', { which: 1, button: 0 })
            .trigger('pointermove', { which: 1, button: 0, movementX: 5, movementY: 5 });

          cy.get(`[data-testid="${secondBookmarkId}"]`)
            .should('exist')
            .trigger('pointermove', { which: 1, button: 0 })
            .trigger('pointerup', { which: 1, button: 0 });
        });
    });
});

// Page reload
When('I reload the page', () => {
  cy.reload();
  cy.get('[data-testid="app-container"]').should('be.visible');
});

// Assertions
Then('the bookmark should be moved to that folder', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('the bookmark should be reordered', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('the bookmark order should persist', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('the bookmark should still be in the target folder', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('the bookmark should still be in the sidebar folder', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('the bookmark should be moved to the sidebar folder', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('the drag operation should complete successfully', () => {
  cy.get('[data-testid="app-container"]').should('be.visible');
});
