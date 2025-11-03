import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('only results matching {string} should be displayed', (query: string) => {
  const q = query.toLowerCase();
  cy.get('[data-testid^="bookmark-item-"]').each(($el) => {
    const text = ($el.text() || '').toLowerCase();
    expect(text).to.contain(q);
  });
});

Then('no results should match', () => {
  cy.get('[data-testid^="bookmark-item-"]').should('have.length', 0);
});
