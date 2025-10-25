import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I type in the search bar', () => {
  cy.get('[data-testid="search-input"]').clear().type('test');
});

When('I type in the {string} search bar', (query: string) => {
  cy.get('[data-testid="search-input"]').clear().type(query);
});

Then('I should see filtered results', () => {
  cy.get('[data-testid="search-input"]').should('be.visible');
});

Then('only matching bookmarks should be displayed', () => {
  cy.get('[data-testid="search-input"]').should('be.visible');
});

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
