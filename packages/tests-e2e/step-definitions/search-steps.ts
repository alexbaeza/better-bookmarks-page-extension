import { Then } from '@badeball/cypress-cucumber-preprocessor';

/**
 * Wait for debounced search to complete
 * Search has 150ms debounce + React deferred value delay
 */
const waitForSearchDebounce = () => {
  // Wait for debounce (150ms) + React deferred value + rendering buffer
  cy.wait(300);
};

Then('only results matching {string} should be displayed', (query: string) => {
  waitForSearchDebounce();
  const q = query.toLowerCase();
  // Use Cypress's retry mechanism - it will retry until condition is met or timeout
  cy.get('[data-testid^="bookmark-item-"]', { timeout: 2000 }).should('have.length.greaterThan', 0);
  cy.get('[data-testid^="bookmark-item-"]').each(($el) => {
    const text = ($el.text() || '').toLowerCase();
    expect(text).to.contain(q);
  });
});

Then('no results should match', () => {
  waitForSearchDebounce();
  // Use Cypress's retry mechanism - it will retry until condition is met or timeout
  cy.get('[data-testid^="bookmark-item-"]', { timeout: 2000 }).should('have.length', 0);
});
