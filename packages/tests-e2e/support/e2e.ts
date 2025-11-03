beforeEach(() => {
  cy.window().then((win) => {
    win.process = win.process || {};
    win.process.env = win.process.env || {};
    win.process.env.NODE_ENV = 'test';
  });
});

Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false;
});

Cypress.on('window:before:load', (win) => {
  const style = win.document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  win.document.head.appendChild(style);
});
