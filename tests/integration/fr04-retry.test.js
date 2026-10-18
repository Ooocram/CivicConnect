// tests/integration/fr04-retry.test.js
// Evidence for closing RSK-05 (ORM transaction deadlocks): the retry path in
// request.service.js is exercised by injecting the PostgreSQL error codes that trigger it.
//   40P01 = deadlock_detected, 40001 = serialization_failure
// The retry limit asserted below (3 attempts) must match MAX_ATTEMPTS in the service.
const request = require('supertest');
const app = require('../../src/app');
const requestRepo = require('../../src/persistence/request.repository');
const {
  sequelize, ServiceRequest, Comment, resetDb, createStaff, createOpenRequest, tokenFor,
} = require('../helpers/db');

const pgError = (code) => Object.assign(new Error(`simulated postgres error ${code}`), { original: { code } });

let staff, openRequest;
beforeEach(async () => {
  await resetDb();
  staff = await createStaff();
  openRequest = await createOpenRequest();
});
afterAll(() => sequelize.close());

const resolve = () =>
  request(app)
    .put(`/api/v1/requests/${openRequest.id}/resolve`)
    .set('Authorization', `Bearer ${tokenFor(staff)}`)
    .send({ comment: 'Fixed by municipal crew' });

describe('FR-04 retry on transient database errors (RSK-05)', () => {
  test.each(['40P01', '40001'])('retries once after a transient %s and still resolves exactly once', async (code) => {
    const spy = jest.spyOn(requestRepo, 'findByIdForUpdate').mockRejectedValueOnce(pgError(code));

    const res = await resolve();

    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalledTimes(2); // 1st attempt failed, 2nd succeeded
    expect((await ServiceRequest.findByPk(openRequest.id)).status).toBe('Resolved');
    expect(await Comment.count({ where: { requestId: openRequest.id } })).toBe(1); // no duplicate comment
  });

  test('gives up after 3 attempts on a persistent deadlock: 500, request still Open, no comment', async () => {
    const spy = jest.spyOn(requestRepo, 'findByIdForUpdate').mockRejectedValue(pgError('40P01'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const res = await resolve();

    expect(res.status).toBe(500);
    expect(spy).toHaveBeenCalledTimes(3);
    expect((await ServiceRequest.findByPk(openRequest.id)).status).toBe('Open');
    expect(await Comment.count()).toBe(0);
  });

  test('does not retry an error that is not a deadlock (e.g. unique violation 23505)', async () => {
    const spy = jest.spyOn(requestRepo, 'findByIdForUpdate').mockRejectedValue(pgError('23505'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const res = await resolve();

    expect(res.status).toBe(500);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
