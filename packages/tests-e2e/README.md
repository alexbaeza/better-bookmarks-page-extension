# E2E Tests

This directory contains all end-to-end tests for the Better Bookmarks extension.

## Structure

```
test/e2e/
├── package.json          # E2E-specific dependencies
├── tsconfig.json         # TypeScript configuration for E2E tests
├── cypress.config.ts     # Cypress configuration
├── features/             # Cucumber feature files
├── step-definitions/      # Step definition implementations
└── support/              # Cypress support files
```

## Setup

1. Install dependencies (from root):
   ```bash
   pnpm install
   ```

2. Build and start the main application:
   ```bash
   pnpm run build
   pnpm run preview
   ```

3. Run E2E tests (from root):
   ```bash
   pnpm run test:e2e
   ```

## Available Scripts (from root)

- `pnpm run test:e2e` - Run all E2E tests
- `pnpm run test:e2e:headed` - Open Cypress in headed mode
- `pnpm run test:e2e:chrome` - Run tests in Chrome browser
- `pnpm run test:e2e:firefox` - Run tests in Firefox browser
- `pnpm run test:e2e:spec <path>` - Run specific test file
- `pnpm run test:e2e:debug` - Run tests in debug mode

## Available Scripts (from e2e directory)

- `pnpm test` - Run all E2E tests
- `pnpm run test:headed` - Open Cypress in headed mode
- `pnpm run test:chrome` - Run tests in Chrome browser
- `pnpm run test:firefox` - Run tests in Firefox browser
- `pnpm run test:spec <path>` - Run specific test file
- `pnpm run test:debug` - Run tests in debug mode
- `pnpm run build:main` - Build the main application
- `pnpm run preview:main` - Start preview server for testing
- `pnpm run dev:main` - Start development server

## Configuration

The E2E tests use:
- **pnpm** for package management
- **Cypress** for test execution
- **Cucumber** for BDD-style test definitions
- **TypeScript** for step definitions
- **ESBuild** for fast compilation

All configuration is self-contained within this directory, but can be run from the root using pnpm workspace commands.
