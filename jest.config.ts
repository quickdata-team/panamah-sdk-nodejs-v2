export default {
  rootDir: __dirname,
  displayName: 'tests',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  coverageReporters: ['json-summary', 'text', 'lcov'],
};
