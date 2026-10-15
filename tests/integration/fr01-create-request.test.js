// Tests #1 and #2 (FR-01, the M2 "Golden Trace"):
//   #1  positive: a valid request is accepted, stored and given a Tracking ID
//   #2  negative: a request missing its title is rejected and NOTHING is stored
// Style: Supertest drives the real Express app (route -> controller -> service -> repo -> Postgres).
const request = require("supertest");
const app = require("../../src/app");
const {
  sequelize,
  ServiceRequest,
  resetDb,
  createCategory,
} = require("../helpers/db");

beforeEach(resetDb);
afterAll(() => sequelize.close());

describe("POST /api/v1/requests (FR-01)", () => {
  // ---- TEST #1 (required): positive path -----------------------------------
  test("creates a request, returns 201 and a Tracking ID, and persists it as Open", async () => {
    const category = await createCategory();

    const res = await request(app).post("/api/v1/requests").send({
      title: "  Pothole on Main St  ", // padded on purpose: service must trim
      description: "Deep pothole near the taxi rank",
      categoryId: category.id,
      location: "Main St, Soshanguve",
    });

    // HTTP contract (unchanged from the M2 Golden Trace response shape)
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Service request submitted successfully");
    expect(res.body.trackingId).toMatch(/^REQ-[0-9A-F]{8}$/);

    // Persistence: the row really exists with the right values
    const saved = await ServiceRequest.findOne({
      where: { trackingId: res.body.trackingId },
    });
    expect(saved).not.toBeNull();
    expect(saved.title).toBe("Pothole on Main St");
    expect(saved.status).toBe("Open");
    expect(saved.categoryId).toBe(category.id);
  });

  // ---- TEST #2 (required): negative path / validation -----------------------
  test("rejects a request with no title: 400 VALIDATION_ERROR and nothing is stored", async () => {
    const res = await request(app)
      .post("/api/v1/requests")
      .send({ description: "Description but no title" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.message).toBe("Title and description are required."); // same text as M2
    expect(await ServiceRequest.count()).toBe(0); // validation fired BEFORE any DB write
  });

  // ---- Extra validation coverage (same rule, other bad inputs) ---------------
  test.each([
    [
      "blank (whitespace-only) title",
      { title: "   ", description: "x" },
      "VALIDATION_ERROR",
    ],
    ["missing description", { title: "x" }, "VALIDATION_ERROR"],
    [
      "non-integer categoryId",
      { title: "x", description: "y", categoryId: "abc" },
      "VALIDATION_ERROR",
    ],
    [
      "title over 200 characters",
      { title: "a".repeat(201), description: "y" },
      "VALIDATION_ERROR",
    ],
    [
      "categoryId that does not exist",
      { title: "x", description: "y", categoryId: 9999 },
      "INVALID_REFERENCE",
    ],
  ])("rejects %s with 400", async (_label, body, code) => {
    const res = await request(app).post("/api/v1/requests").send(body);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(code);
    expect(await ServiceRequest.count()).toBe(0);
  });

  test("rejects malformed JSON with 400 INVALID_JSON", async () => {
    const res = await request(app)
      .post("/api/v1/requests")
      .set("Content-Type", "application/json")
      .send('{"title": "oops"');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_JSON");
  });
});
