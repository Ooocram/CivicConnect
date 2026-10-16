const {
  parseRequestId,
  validateNewRequest,
  assertValidResolutionComment,
  assertResolvable,
} = require("../../src/domain/serviceRequest.rules");

describe("Domain rules — request validation and status changes", () => {
  test("U-01: accepts a valid request and trims title/description", () => {
    expect(
      validateNewRequest({
        title: "  Pothole on Main Road  ",
        description: "  A pothole near the library.  ",
        categoryId: 1,
        location: "Main Road",
      }),
    ).toEqual({
      title: "Pothole on Main Road",
      description: "A pothole near the library.",
      categoryId: 1,
      location: "Main Road",
    });
  });

  test("U-02: rejects a missing or blank title", () => {
    for (const title of [undefined, "", "   "]) {
      expect(() =>
        validateNewRequest({ title, description: "Description" }),
      ).toThrow("Title and description are required.");
    }
  });

  test("U-03: rejects a missing or blank description", () => {
    for (const description of [undefined, "", "   "]) {
      expect(() =>
        validateNewRequest({ title: "Valid title", description }),
      ).toThrow("Title and description are required.");
    }
  });

  test("U-04: enforces the 200-character title boundary", () => {
    expect(() =>
      validateNewRequest({ title: "T".repeat(201), description: "Description" }),
    ).toThrow("Title must be at most 200 characters.");

    expect(
      validateNewRequest({ title: "T".repeat(200), description: "Description" }).title,
    ).toHaveLength(200);
  });

  test("U-05: rejects categoryId values that are not positive integers", () => {
    for (const categoryId of [0, -1, 1.5, "1"]) {
      expect(() =>
        validateNewRequest({
          title: "Valid title",
          description: "Description",
          categoryId,
        }),
      ).toThrow("categoryId must be a positive integer.");
    }
  });

  test("U-06: accepts an omitted categoryId as null when the domain rule permits it", () => {
    expect(
      validateNewRequest({ title: "Valid title", description: "Description" }).categoryId,
    ).toBeNull();
  });

  test("U-07: parses only positive integer request IDs", () => {
    expect(parseRequestId("12")).toBe(12);
    for (const raw of ["0", "-1", "1.5", "abc", ""]) {
      expect(() => parseRequestId(raw)).toThrow("Request id must be a positive integer.");
    }
  });

  test("U-08: requires a non-blank resolution comment and trims valid comments", () => {
    expect(assertValidResolutionComment("  Fixed the issue.  ")).toBe("Fixed the issue.");
    for (const comment of [undefined, "", "   "]) {
      expect(() => assertValidResolutionComment(comment)).toThrow(
        "A resolution comment is required to resolve a request.",
      );
    }
  });

  test("U-09: prevents resolving an already resolved request", () => {
    expect(() => assertResolvable({ status: "Resolved" })).toThrow(
      "This request is already resolved.",
    );
    expect(() => assertResolvable({ status: "Open" })).not.toThrow();
    expect(() => assertResolvable({ status: "In Progress" })).not.toThrow();
  });
});
