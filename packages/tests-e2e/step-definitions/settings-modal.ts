import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I have modified various settings', () => {
  cy.get('[data-testid="sidebar-settings-toggle"]').scrollIntoView().click({ force: true });
  cy.get('[data-testid="search-bar-enabled-toggle"]').scrollIntoView().click({ force: true });
});

When('I select the {string} theme', (theme: string) => {
  cy.get(`[data-testid="theme-${theme}"]`).scrollIntoView({ block: 'center' }).click({ force: true });
});
