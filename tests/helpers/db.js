// tests/helpers/db.js
// Shared fixtures for the integration tests (real database, no mocks of the DB layer).
const jwt = require('jsonwebtoken');
const { sequelize, User, Category, ServiceRequest, Comment } = require('../../src/persistence/models');

/** Empty every table and restart ids so each test starts from a known state. */
async function resetDb() {
  await sequelize.query(
    'TRUNCATE "Comments", "ServiceRequests", "Categories", "Users" RESTART IDENTITY CASCADE'
  );
}

const createStaff = () => User.create({ name: 'Test Staff', email: 'staff@test.local', role: 'staff' });
const createRequester = () => User.create({ name: 'Test Citizen', email: 'citizen@test.local', role: 'requester' });
const createCategory = () => Category.create({ name: 'Roads & Potholes' });

/** Insert an Open request directly (bypasses the API so FR-04 tests don't depend on FR-01). */
const createOpenRequest = (overrides = {}) =>
  ServiceRequest.create({
    trackingId: `REQ-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    title: 'Broken streetlight',
    description: 'Light out on Church Street',
    status: 'Open',
    ...overrides,
  });

/** Same token shape the real auth middleware expects (see ADR-05). */
const tokenFor = (user) =>
  jwt.sign({ uid: user.id, role: user.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });

module.exports = {
  sequelize, ServiceRequest, Comment,
  resetDb, createStaff, createRequester, createCategory, createOpenRequest, tokenFor,
};
