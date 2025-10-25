import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'support/e2e.ts',
    specPattern: ['**/*.cy.ts', 'features/**/*.feature'],
    viewportWidth: 1200,
    viewportHeight: 800,
    // Performance optimizations
    video: false, // Disable video recording for faster tests
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 2000,
    requestTimeout: 2000,
    responseTimeout: 2000,
    pageLoadTimeout: 2000,
    scrollBehavior: 'center',

    // Disable animations for faster tests
    animationDistanceThreshold: 0,
    // Faster element interactions
    waitForAnimations: false,
    env: {
      NODE_ENV: 'test',
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});
