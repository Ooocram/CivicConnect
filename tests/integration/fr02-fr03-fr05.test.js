const request = require('supertest');
const app = require('../../src/app');
const { sequelize, resetDb, createStaff, createRequester, createCategory, createOpenRequest, tokenFor } = require('../helpers/db');
beforeEach(resetDb);
afterAll(() => sequelize.close());

describe('M4 missing-scope backend closure', () => {
  test('FR-02 public tracking status and history expose no internal staff information', async () => {
    const item = await createOpenRequest();
    const status = await request(app).get('/api/v1/requests/track/' + item.trackingId);
    expect(status.status).toBe(200);
    expect(status.body.data.status).toBe('Open');
    expect(status.body.data.id).toBeUndefined();
    const history = await request(app).get('/api/v1/requests/track/' + item.trackingId + '/history');
    expect(history.status).toBe(200);
    expect(history.body.data.events[0].type).toBe('SUBMITTED');
    expect((await request(app).get('/api/v1/requests/track/REQ-FFFFFFFF')).status).toBe(404);
  });
  test('FR-03 staff listing, category filter and assignment reject unauthenticated access', async () => {
    const staff = await createStaff();
    const category = await createCategory();
    const item = await createOpenRequest({ categoryId: category.id });
    expect((await request(app).get('/api/v1/requests')).status).toBe(401);
    const list = await request(app).get('/api/v1/requests').set('Authorization', 'Bearer ' + tokenFor(staff)).query({ categoryId: category.id });
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
    const assigned = await request(app).put('/api/v1/requests/' + item.id + '/assign').set('Authorization', 'Bearer ' + tokenFor(staff));
    expect(assigned.status).toBe(200);
    expect(assigned.body.data.assignedTo).toBe(staff.id);
    expect(assigned.body.data.status).toBe('In Progress');
  });
  test('FR-03 requester cannot list or assign; conflict on assignment to different staff', async () => {
    const requester = await createRequester();
    const staff = await createStaff();
    const item = await createOpenRequest();
    expect((await request(app).get('/api/v1/requests').set('Authorization', 'Bearer ' + tokenFor(requester))).status).toBe(403);
    expect((await request(app).put('/api/v1/requests/' + item.id + '/assign').set('Authorization', 'Bearer ' + tokenFor(requester))).status).toBe(403);
    expect((await request(app).put('/api/v1/requests/' + item.id + '/assign').set('Authorization', 'Bearer ' + tokenFor(staff))).status).toBe(200);
  });
  test('FR-05 management summary reports exact status counts', async () => {
    const staff = await createStaff();
    await createOpenRequest();
    const resolvedItem = await createOpenRequest();
    const resolvedResponse = await request(app).put('/api/v1/requests/' + resolvedItem.id + '/resolve').set('Authorization', 'Bearer ' + tokenFor(staff)).send({ comment: 'Completed during integration test' });
    expect(resolvedResponse.status).toBe(200);
    const result = await request(app).get('/api/v1/requests/management/summary').set('Authorization', 'Bearer ' + tokenFor(staff));
    expect(result.status).toBe(200);
    expect(result.body.data.open).toBe(1);
    expect(result.body.data.resolved).toBe(1);
    expect(result.body.data.overdue).toBeNull();
    expect((await request(app).get('/api/v1/requests/management/summary')).status).toBe(401);
  });
});
