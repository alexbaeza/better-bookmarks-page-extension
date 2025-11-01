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
  cy.get(`#color-input-${colorKey}`)
    .scrollIntoView()
    .should('be.visible')
    .then(($input) => {
      // For color inputs, we need to set the value property directly and trigger input/change events
      const input = $input[0] as HTMLInputElement;
      input.value = color;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
});

Then('the {string} field should contain {string}', (fieldName: string, expectedValue: string) => {
  // Use data-testid by default, fallback to id for legacy support
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('have.value', expectedValue);
});
