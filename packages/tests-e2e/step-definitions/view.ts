import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I can see bookmarks in grid view', () => {
  cy.get('[data-view-mode="grid"]').should('be.visible');
});

Then('I should see bookmarks in list view', () => {
  cy.get('[data-view-mode="list"]').should('be.visible');
});

Then('I should see bookmarks in grid view', () => {
  cy.get('[data-view-mode="grid"]').should('be.visible');
});
