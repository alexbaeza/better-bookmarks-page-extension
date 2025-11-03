import { Before, Given, When } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Given('the bookmark extension is loaded', () => {
  cy.visit('/');
  cy.get('[data-testid="app-container"]').should('be.visible');
});

When('the page loads', () => {
  cy.get('[data-testid="app-container"]').should('be.visible');
});
