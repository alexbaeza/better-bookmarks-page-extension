import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('I can see bookmarks and folders', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
  cy.get('[data-testid^="bookmark-folder-item-"]').its('length').should('be.greaterThan', 0);
});

Then('I should see the sidebar', () => {
  cy.get('[data-testid="sidebar"]').should('be.visible');
});

Then('I should see sidebar folders', () => {
  cy.get('[data-testid^="sidebar-folder-item-"]').its('length').should('be.greaterThan', 0);
});

When('I click {string} in the sidebar', (itemText: string) => {
  cy.get('[data-testid="sidebar"]').within(() => {
    cy.contains('button', itemText).click();
  });
});

Then('I should see all bookmarks', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('I should see uncategorized bookmarks', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

When('I expand a sidebar folder', () => {
  cy.get('[data-testid^="sidebar-folder-item-"]').first().click();
});

Then('I should see expanded folder contents', () => {
  cy.get('[data-testid^="sidebar-folder-item-"]').first().closest('li').should('have.attr', 'aria-expanded', 'true');
});

When('I collapse the sidebar folder', () => {
  cy.get('[data-testid^="sidebar-folder-item-"]').first().click();
});

Then('I should see collapsed folder contents', () => {
  cy.get('[data-testid^="sidebar-folder-item-"]').first().closest('li').should('have.attr', 'aria-expanded', 'false');
});

When('I click on a sidebar folder', () => {
  cy.get('[data-testid^="sidebar-folder-item-"]').first().click();
});

Then('I should see the sidebar flyout', () => {
  cy.get('[data-testid="sidebar-flyout"]').should('be.visible');
});

Then('I should see folder contents in flyout', () => {
  cy.get('[data-testid="flyout-title"]').should('be.visible');
  cy.get('[data-testid="sidebar-flyout"]').within(() => {
    cy.get('button').should('have.length.greaterThan', 0);
  });
});

When('I close the sidebar flyout', () => {
  cy.get('[data-testid="flyout-close-button"]').click();
});

Then('I should not see the sidebar flyout', () => {
  cy.get('[data-testid="sidebar-flyout"]').should('not.exist');
});
