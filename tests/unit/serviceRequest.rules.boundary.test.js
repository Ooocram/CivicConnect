// tests/unit/serviceRequest.rules.boundary.test.js
// UNIT tests for the Domain layer (src/domain/serviceRequest.rules.js).
// These are pure functions: no Express, no database, so they run in milliseconds.
// Techniques: equivalence partitioning (valid / missing / blank / wrong type) and
// boundary-value analysis (exactly at the limit vs one over the limit).
const { AppError } = require('../../src/domain/errors');
const {
  parseRequestId, validateNewRequest, assertValidResolutionComment, assertResolvable,
} = require('../../src/domain/serviceRequest.rules');

/** Asserts the call throws an AppError with the expected HTTP status and error code. */
function expectAppError(fn, status, code) {
  let caught;
  try { fn(); } catch (e) { caught = e; }
  expect(caught).toBeInstanceOf(AppError);
  expect(caught.status).toBe(status);
  expect(caught.code).toBe(code);
}

describe('parseRequestId', () => {
  test.each([['7', 7], [12, 12], ['100', 100]])('accepts %p as %p', (raw, expected) => {
    expect(parseRequestId(raw)).toBe(expected);
  });
  test.each(['abc', '0', '-1', '1.5', '', '  ', null, undefined])('rejects %p with 400 INVALID_ID', (raw) => {
    expectAppError(() => parseRequestId(raw), 400, 'INVALID_ID');
  });
});

describe('validateNewRequest (FR-01)', () => {
  test('trims text and defaults the optional fields to null', () => {
    expect(validateNewRequest({ title: '  Pothole ', description: ' Deep ' }))
      .toEqual({ title: 'Pothole', description: 'Deep', categoryId: null, location: null });
  });
  test('keeps a valid categoryId and location', () => {
    expect(validateNewRequest({ title: 't', description: 'd', categoryId: 3, location: 'Main St' }))
      .toMatchObject({ categoryId: 3, location: 'Main St' });
  });
  test.each([
    ['no body', undefined], ['null body', null], ['empty object', {}],
    ['missing title', { description: 'x' }], ['missing description', { title: 'x' }],
    ['blank title', { title: '   ', description: 'x' }], ['non-string title', { title: 123, description: 'x' }],
  ])('rejects %s with the M2 message', (_label, body) => {
    expectAppError(() => validateNewRequest(body), 400, 'VALIDATION_ERROR');
    expect(() => validateNewRequest(body)).toThrow('Title and description are required.');
  });
  // Boundary values: the limit itself is accepted, one more is rejected.
  test('title: 200 characters accepted, 201 rejected', () => {
    expect(() => validateNewRequest({ title: 'a'.repeat(200), description: 'd' })).not.toThrow();
    expectAppError(() => validateNewRequest({ title: 'a'.repeat(201), description: 'd' }), 400, 'VALIDATION_ERROR');
  });
  test('description: 5000 characters accepted, 5001 rejected', () => {
    expect(() => validateNewRequest({ title: 't', description: 'a'.repeat(5000) })).not.toThrow();
    expectAppError(() => validateNewRequest({ title: 't', description: 'a'.repeat(5001) }), 400, 'VALIDATION_ERROR');
  });
  test('location: 255 characters accepted, 256 rejected', () => {
    expect(() => validateNewRequest({ title: 't', description: 'd', location: 'a'.repeat(255) })).not.toThrow();
    expectAppError(() => validateNewRequest({ title: 't', description: 'd', location: 'a'.repeat(256) }), 400, 'VALIDATION_ERROR');
  });
  test.each(['abc', 0, -3, 1.5])('rejects categoryId %p', (categoryId) => {
    expectAppError(() => validateNewRequest({ title: 't', description: 'd', categoryId }), 400, 'VALIDATION_ERROR');
  });
});

describe('assertValidResolutionComment (FR-04)', () => {
  test('returns the trimmed comment', () => {
    expect(assertValidResolutionComment('  Fixed by crew  ')).toBe('Fixed by crew');
  });
  test.each([undefined, null, '', '   ', 42])('rejects %p with COMMENT_REQUIRED', (c) => {
    expectAppError(() => assertValidResolutionComment(c), 400, 'COMMENT_REQUIRED');
  });
  test('2000 characters accepted, 2001 rejected with COMMENT_TOO_LONG', () => {
    expect(assertValidResolutionComment('a'.repeat(2000))).toHaveLength(2000);
    expectAppError(() => assertValidResolutionComment('a'.repeat(2001)), 400, 'COMMENT_TOO_LONG');
  });
});

describe('assertResolvable (status rule)', () => {
  test.each(['Open', 'In Progress'])('allows resolving a request that is %s', (status) => {
    expect(() => assertResolvable({ status })).not.toThrow();
  });
  test('rejects a request that is already Resolved with 409', () => {
    expectAppError(() => assertResolvable({ status: 'Resolved' }), 409, 'ALREADY_RESOLVED');
  });
});
