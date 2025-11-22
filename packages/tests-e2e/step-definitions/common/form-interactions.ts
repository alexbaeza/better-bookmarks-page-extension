import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I type {string} in the {string} field', (value: string, fieldName: string) => {
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('be.visible').should('be.enabled').clear().type(value);
});

When('I enter {string} as {string}', (value: string, fieldName: string) => {
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('be.visible').should('be.enabled').clear().type(value);
});

When('I select color {string} for {string}', (color: string, colorKey: string) => {
  cy.get(`#color-input-${colorKey}`)
    .scrollIntoView()
    .should('be.visible')
    .then(($input) => {
      const input = $input[0] as HTMLInputElement;
      input.value = color;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
});

Then('the {string} field should contain {string}', (fieldName: string, expectedValue: string) => {
  const selector = fieldName.startsWith('#') ? fieldName : `[data-testid="${fieldName}"]`;
  cy.get(selector).should('have.value', expectedValue);
});

When('I select {string} from {string}', (optionText: string, selectTestId: string) => {
  const selector = selectTestId.startsWith('#') ? selectTestId : `[data-testid="${selectTestId}"]`;
  cy.get(selector).select(optionText, { force: true });
  // Wait a bit for the language change to apply and UI to re-render
  cy.wait(200);
});
