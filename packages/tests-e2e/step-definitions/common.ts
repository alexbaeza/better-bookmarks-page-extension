import { Before, Given, When } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  // Reset state between tests
  cy.clearCookies();
  cy.clearLocalStorage();
  // Note: sessionStorage is typically cleared when navigating/visiting a page
});

Given('the bookmark extension is loaded', () => {
  cy.visit('/');
  cy.get('[data-testid="app-container"]').should('be.visible');
});

When('the page loads', () => {
  cy.get('[data-testid="app-container"]').should('be.visible');
});
