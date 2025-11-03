import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I click {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click({ force: true });
});

When('I click the first {string}', (testId: string) => {
  if (testId === 'item-options-button') {
    // The item-options-button is hidden with opacity-0 until the bookmark item is hovered.
    // We need to hover over the parent bookmark item first to make the button visible.
    cy.get('[data-testid^="bookmark-item-"], [data-testid^="bookmark-folder-item-"]')
      .first()
      .should('exist')
      .trigger('mouseenter');
    cy.wait(200);
    cy.get(`[data-testid="${testId}"]`).first().should('exist').click({ force: true });
  } else {
    cy.get(`[data-testid="${testId}"]`).first().should('exist').click({ force: true });
  }
});

When('I toggle {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).click({ force: true });
});

When('I click the {string} button', (buttonText: string) => {
  cy.contains('button', buttonText, { matchCase: false }).scrollIntoView().click({ force: true });
});
