import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I should see the {string} section', (sectionName: string) => {
  cy.get(`[data-testid="${sectionName}"]`).scrollIntoView().should('be.visible');
});

Then('I should see {string}', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).should('be.visible');
});

Then('{string} should not exist', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).should('not.exist');
});

Then('the {string} color should be {string}', (colorKey: string, expectedColor: string) => {
  // Get the computed CSS custom property value
  cy.get('[data-testid="app-container"]').then(($el) => {
    const computedStyle = window.getComputedStyle($el[0]);
    const cssVarName = `--colors-${colorKey}`;
    const computedColor = computedStyle.getPropertyValue(cssVarName);

    // Convert hex to RGB format for comparison
    const hexToRgb = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16);
      const g = Number.parseInt(hex.slice(3, 5), 16);
      const b = Number.parseInt(hex.slice(5, 7), 16);
      return `${r} ${g} ${b}`;
    };

    const expectedRgb = hexToRgb(expectedColor);
    expect(computedColor.trim()).to.equal(expectedRgb);
  });
});

Then('the app should have custom theme with {string} color', (_colorKey: string) => {
  cy.get('[data-testid="app-container"]').should('have.class', 'custom');
  cy.get('#custom-theme-style').should('exist');
});

Then('the app should have {string} theme', (themeName: string) => {
  cy.get('[data-testid="app-container"]').should('have.class', themeName);
});

Then('I should see {string} in the {string}', (text: string, containerTestId: string) => {
  cy.get(`[data-testid="${containerTestId}"]`).should('contain', text);
});

Then('I should see {string} in the app', (text: string) => {
  cy.contains(text).should('be.visible');
});

Then('the modal should be visible', () => {
  // This is now deprecated - use specific modal test IDs instead
  cy.get('[data-testid="bookmark-form-modal-close-button"]').should('be.visible');
});

Then('the {string} input should be ready', (inputTestId: string) => {
  cy.get(`[data-testid="${inputTestId}"]`).should('be.visible').should('be.enabled');
});
