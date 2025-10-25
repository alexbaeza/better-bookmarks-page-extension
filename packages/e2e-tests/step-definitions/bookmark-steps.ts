import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I have bookmarks in my browser', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Then('I should see my bookmarks displayed', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});

Given('I can see bookmarks', () => {
  cy.get('[data-testid^="bookmark-item-"]').its('length').should('be.greaterThan', 0);
});
