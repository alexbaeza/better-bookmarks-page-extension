import { When } from '@badeball/cypress-cucumber-preprocessor';

// Generic testid-based interactions - these are the main reusable steps
When('I click {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click({ force: true });
});

When('I click the first {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).first().click({ force: true });
});

When('I toggle {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click({ force: true });
});

// Generic button interactions (by text content)
When('I click the {string} button', (buttonText: string) => {
  cy.contains('button', buttonText, { matchCase: false }).scrollIntoView().click({ force: true });
});
