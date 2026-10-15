// tests/setup/env.js
// Runs before every test file. Two jobs:
//  1) make sure the app boots in "test" mode with a JWT secret;
//  2) SAFETY GUARD: these tests TRUNCATE tables, so refuse to run unless they point at a
//     database that is clearly a separate test database (never the dev database).
require('dotenv').config({ quiet: true }); // loads .env; real env vars still win

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'jest-only-secret';

const testUrl = process.env.TEST_DATABASE_URL;
if (!testUrl) {
  throw new Error('TEST_DATABASE_URL is not set. Add it to .env (see .env.example).');
}
if (testUrl === process.env.DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL must differ from DATABASE_URL. Refusing to run destructive tests.');
}
if (!/test/i.test(new URL(testUrl).pathname)) {
  throw new Error('The test database name must contain "test". Refusing to run destructive tests.');
}
