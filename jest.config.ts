/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
