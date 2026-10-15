// tests/integration/fr04-resolve-request.test.js
// Task B test #3 (FR-04, transactional resolution) plus the evidence that it is really atomic.
//   #3  integration: PUT /resolve updates the status AND inserts the comment together
//   +   atomicity:   if the comment insert fails, the status update is ROLLED BACK
//   +   RBAC, validation, 404/409 and a concurrency (RSK-05) check
const request = require('supertest');
const app = require('../../src/app');
const commentRepo = require('../../src/persistence/comment.repository');
const {
  sequelize, ServiceRequest, Comment, resetDb,
  createStaff, createRequester, createOpenRequest, tokenFor,
} = require('../helpers/db');

let staff, requester, openRequest;

beforeEach(async () => {
  await resetDb();
  staff = await createStaff();
  requester = await createRequester();
  openRequest = await createOpenRequest();
});
afterAll(() => sequelize.close());

const resolve = (id, body, user = staff) => {
  const req = request(app).put(`/api/v1/requests/${id}/resolve`);
  if (user) req.set('Authorization', `Bearer ${tokenFor(user)}`);
  return req.send(body);
};

describe('PUT /api/v1/requests/:id/resolve (FR-04)', () => {
  // ---- TEST #3 (required): transactional integration -------------------------
  test('resolves the request and stores the resolution comment together (both writes commit)', async () => {
    const res = await resolve(openRequest.id, { comment: '  Streetlight replaced by municipal crew.  ' });

    expect(res.status).toBe(200);

    // Write #1 committed: status + audit fields
    const after = await ServiceRequest.findByPk(openRequest.id);
    expect(after.status).toBe('Resolved');
    expect(after.resolvedAt).toBeInstanceOf(Date);
    expect(after.resolvedBy).toBe(staff.id);

    // Write #2 committed: exactly one RESOLUTION comment, trimmed, by the staff member
    const comments = await Comment.findAll({ where: { requestId: openRequest.id } });
    expect(comments).toHaveLength(1);
    expect(comments[0].type).toBe('RESOLUTION');
    expect(comments[0].body).toBe('Streetlight replaced by municipal crew.');
    expect(comments[0].authorId).toBe(staff.id);
  });

  // ---- ATOMICITY: the key proof for the PED ----------------------------------
  test('ROLLS BACK the status change when the comment insert fails (no partial state)', async () => {
    // Force write #2 to fail AFTER write #1 has already executed inside the transaction.
    jest.spyOn(commentRepo, 'createResolutionComment').mockRejectedValueOnce(new Error('simulated DB failure'));
    jest.spyOn(console, 'error').mockImplementation(() => {}); // keep test output clean

    const res = await resolve(openRequest.id, { comment: 'This should never be saved' });

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');

    const after = await ServiceRequest.findByPk(openRequest.id);
    expect(after.status).toBe('Open');        // write #1 was undone
    expect(after.resolvedAt).toBeNull();
    expect(after.resolvedBy).toBeNull();
    expect(await Comment.count()).toBe(0);    // and no orphan comment
  });

  // ---- FR-04 rule: comment is mandatory ---------------------------------------
  test.each([
    ['missing', {}],
    ['empty',   { comment: '' }],
    ['blank',   { comment: '    ' }],
  ])('refuses to resolve when the comment is %s (400 COMMENT_REQUIRED, status unchanged)', async (_l, body) => {
    const res = await resolve(openRequest.id, body);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('COMMENT_REQUIRED');
    expect((await ServiceRequest.findByPk(openRequest.id)).status).toBe('Open');
    expect(await Comment.count()).toBe(0);
  });

  // ---- Access control (STRIDE: elevation of privilege) -----------------------
  test('401 without a token, 403 for a non-staff user; nothing changes either way', async () => {
    const anon = await resolve(openRequest.id, { comment: 'x' }, null);
    expect(anon.status).toBe(401);

    const citizen = await resolve(openRequest.id, { comment: 'x' }, requester);
    expect(citizen.status).toBe(403);
    expect(citizen.body.error.code).toBe('FORBIDDEN');

    expect((await ServiceRequest.findByPk(openRequest.id)).status).toBe('Open');
    expect(await Comment.count()).toBe(0);
  });

  // ---- Not found / bad id / already resolved ----------------------------------
  test('404 for an unknown request and 400 for a non-numeric id', async () => {
    expect((await resolve(99999, { comment: 'x' })).status).toBe(404);
    const bad = await resolve('abc', { comment: 'x' });
    expect(bad.status).toBe(400);
    expect(bad.body.error.code).toBe('INVALID_ID');
  });

  test('409 when already resolved, and no second comment is created', async () => {
    await resolve(openRequest.id, { comment: 'first' });
    const again = await resolve(openRequest.id, { comment: 'second' });

    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe('ALREADY_RESOLVED');
    expect(await Comment.count({ where: { requestId: openRequest.id } })).toBe(1);
  });

  // ---- RSK-05: concurrent updates ----------------------------------------------
  test('5 simultaneous resolves: exactly one wins (200), the rest get 409, one comment total', async () => {
    const results = await Promise.all(
      [1, 2, 3, 4, 5].map((n) => resolve(openRequest.id, { comment: `attempt ${n}` }))
    );
    const codes = results.map((r) => r.status).sort();

    expect(codes).toEqual([200, 409, 409, 409, 409]);
    expect(await Comment.count({ where: { requestId: openRequest.id } })).toBe(1);
  });
});
