import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I select the {string} theme', (theme: string) => {
  cy.get(`[data-testid="theme-${theme}"]`).scrollIntoView().click({ force: true });
});
