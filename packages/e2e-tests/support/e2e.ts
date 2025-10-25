// Set NODE_ENV to test for the browser
beforeEach(() => {
  cy.window().then((win) => {
    // @ts-ignore
    win.process = win.process || {};
    // @ts-ignore
    win.process.env = win.process.env || {};
    // @ts-ignore
    win.process.env.NODE_ENV = 'test';
  });
});

// Global configuration
Cypress.on('uncaught:exception', (_err, _runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // This is useful for browser extension testing
  return false;
});

// Disable animations globally for faster tests
Cypress.on('window:before:load', (win) => {
  // Disable CSS animations and transitions
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
