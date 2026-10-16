// Shared M3 E2E-style API journeys through Express -> service -> PostgreSQL.
// Full browser/frontend E2E cannot be claimed until the frontend exists.
const request = require("supertest");
const app = require("../../src/app");
const { sequelize, ServiceRequest, Comment, resetDb, createStaff, createRequester, tokenFor } = require("../helpers/db");

beforeEach(resetDb);
afterAll(() => sequelize.close());

describe("M3 shared critical system journeys", () => {
  test("E2E-01 citizen submits a request and receives a persisted tracking reference", async () => {
    const response = await request(app).post("/api/v1/requests").send({
      title: "Streetlight outage",
      description: "Streetlight is not working on the corner",
      location: "Main Road"
    });
    expect(response.status).toBe(201);
    expect(response.body.trackingId).toMatch(/^REQ-[0-9A-F]{8}$/);
    const saved = await ServiceRequest.findOne({ where: { trackingId: response.body.trackingId } });
    expect(saved).not.toBeNull();
    expect(saved.status).toBe("Open");
  });

  test("E2E-02 request moves from citizen submission to authorised staff resolution with audit comment", async () => {
    const staff = await createStaff();
    const citizen = await createRequester();
    const submitted = await request(app).post("/api/v1/requests").send({
      title: "Pothole near school",
      description: "Large pothole obstructing traffic",
      location: "School Road"
    });
    expect(submitted.status).toBe(201);
    const saved = await ServiceRequest.findOne({ where: { trackingId: submitted.body.trackingId } });
    expect(saved).not.toBeNull();

    const denied = await request(app).put(`/api/v1/requests/${saved.id}/resolve`)
      .set("Authorization", `Bearer ${tokenFor(citizen)}`)
      .send({ comment: "Unauthorised resolution" });
    expect(denied.status).toBe(403);
    expect((await ServiceRequest.findByPk(saved.id)).status).toBe("Open");

    const resolved = await request(app).put(`/api/v1/requests/${saved.id}/resolve`)
      .set("Authorization", `Bearer ${tokenFor(staff)}`)
      .send({ comment: "Road repaired by crew" });
    expect(resolved.status).toBe(200);
    const final = await ServiceRequest.findByPk(saved.id);
    expect(final.status).toBe("Resolved");
    expect(final.resolvedBy).toBe(staff.id);
    const comments = await Comment.findAll({ where: { requestId: saved.id } });
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toBe("Road repaired by crew");
  });
});
