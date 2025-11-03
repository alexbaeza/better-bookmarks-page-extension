import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    animationDistanceThreshold: 0,
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    env: {
      NODE_ENV: 'test',
    },
    pageLoadTimeout: 10000,
    requestTimeout: 5000,
    responseTimeout: 5000,
    screenshotOnRunFailure: true,
    scrollBehavior: 'center',
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
    specPattern: ['**/*.cy.ts', 'features/**/*.feature'],
    supportFile: 'support/e2e.ts',
    video: false, // Disable video recording for faster tests
    viewportHeight: 800,
    viewportWidth: 1200,
    waitForAnimations: false,
  },
});
