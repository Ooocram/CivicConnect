// jest.config.js  (repo root)
// Integration tests share ONE real Postgres test database, so they must not run in parallel.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup/env.js'],
  maxWorkers: 1,        // one worker -> no cross-test interference on the shared DB
  restoreMocks: true,   // jest.spyOn mocks are undone after every test
  testTimeout: 15000,
};
