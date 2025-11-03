import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I click {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click({ force: true });
});

When('I click the first {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).first().should('exist').click({ force: true });
});

When('I toggle {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click({ force: true });
});

When('I click the {string} button', (buttonText: string) => {
  cy.contains('button', buttonText, { matchCase: false }).scrollIntoView().click({ force: true });
});
