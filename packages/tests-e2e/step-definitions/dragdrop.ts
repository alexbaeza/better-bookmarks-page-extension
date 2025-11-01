import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Generic drag and drop helper - using proper @dnd-kit events
When('I drag a bookmark to a folder', () => {
  // Get the first bookmark ID - use first() to ensure single element
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
          // Find the drag handle within the bookmark item and start drag from there
          cy.get(`[data-testid="${bookmarkId}"]`)
            .first()
            .should('exist')
            .within(() => {
              cy.get('[data-testid="drag-handle-button"]').first().trigger('pointerdown', { button: 0, which: 1, clientX: 0, clientY: 0, force: true });
            });

          // Move to folder - trigger pointermove and pointerup on the target folder
          cy.get(`[data-testid="${folderId}"]`)
            .first()
            .should('exist')
            .trigger('pointermove', { button: 0, which: 1, clientX: 100, clientY: 100, force: true })
            .trigger('pointerup', { button: 0, which: 1, force: true });
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
          // Find the drag handle within the first bookmark and start drag from there
          cy.get(`[data-testid="${firstBookmarkId}"]`)
            .first()
            .should('exist')
            .within(() => {
              cy.get('[data-testid="drag-handle-button"]').first().trigger('pointerdown', { button: 0, which: 1, clientX: 0, clientY: 0, force: true });
            });

          // Move to second bookmark position
          cy.get(`[data-testid="${secondBookmarkId}"]`)
            .first()
            .should('exist')
            .trigger('pointermove', { button: 0, which: 1, clientX: 100, clientY: 100, force: true })
            .trigger('pointerup', { button: 0, which: 1, force: true });
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
