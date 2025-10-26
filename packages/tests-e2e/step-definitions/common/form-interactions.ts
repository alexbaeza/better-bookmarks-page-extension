import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I type {string} in the {string} field', (value: string, fieldName: string) => {
  // Use data-testid by default, fallback to id for legacy support
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('be.visible').should('be.enabled').clear().type(value);
});

// Legacy alias for backward compatibility
When('I enter {string} as {string}', (value: string, fieldName: string) => {
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('be.visible').should('be.enabled').clear().type(value);
});

When('I select color {string} for {string}', (color: string, colorKey: string) => {
  cy.get(`#color-input-${colorKey}`).invoke('val', color).trigger('change');
});

Then('the {string} field should contain {string}', (fieldName: string, expectedValue: string) => {
  // Use data-testid by default, fallback to id for legacy support
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('have.value', expectedValue);
});
