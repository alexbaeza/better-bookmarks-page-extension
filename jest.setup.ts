import '@testing-library/jest-dom';

jest.mock('jotai', () => {
  return {
    __esModule: true,
    ...jest.requireActual('jotai')
  };
});
