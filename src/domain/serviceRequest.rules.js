// src/domain/serviceRequest.rules.js
// DOMAIN LAYER: pure business rules. No Express, no Sequelize -> trivially unit-testable.
// Validation here is the "application-level" safeguard described in Assignment 2
// (client validation is bypassable; the DB constraints are the last line of defence).
const { AppError } = require('./errors');

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 5000;
const MAX_LOCATION = 255;
const MAX_COMMENT = 2000;

const isPositiveInt = (v) => Number.isInteger(v) && v > 0;
const isBlank = (v) => typeof v !== 'string' || v.trim().length === 0;

/** Route param -> safe integer id. Prevents Postgres "invalid input syntax" 500s. */
function parseRequestId(raw) {
  const id = Number(raw);
  if (!isPositiveInt(id)) {
    throw new AppError(400, 'INVALID_ID', 'Request id must be a positive integer.');
  }
  return id;
}

/**
 * FR-01 validation. Message text for the missing-field case is kept identical
 * to the M2 Golden Trace so existing evidence stays valid.
 */
function validateNewRequest(body) {
  const { title, description, categoryId, location } = body || {};

  if (isBlank(title) || isBlank(description)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Title and description are required.');
  }
  if (title.trim().length > MAX_TITLE) {
    throw new AppError(400, 'VALIDATION_ERROR', `Title must be at most ${MAX_TITLE} characters.`);
  }
  if (description.trim().length > MAX_DESCRIPTION) {
    throw new AppError(400, 'VALIDATION_ERROR', `Description must be at most ${MAX_DESCRIPTION} characters.`);
  }
  if (categoryId !== undefined && categoryId !== null && !isPositiveInt(categoryId)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'categoryId must be a positive integer.');
  }
  if (location !== undefined && location !== null &&
      (typeof location !== 'string' || location.length > MAX_LOCATION)) {
    throw new AppError(400, 'VALIDATION_ERROR', `location must be a string of at most ${MAX_LOCATION} characters.`);
  }

  return {
    title: title.trim(),
    description: description.trim(),
    categoryId: categoryId ?? null,
    location: location ?? null,
  };
}

/**
 * FR-04: "Staff must add a comment when resolving a ticket."
 * The comment is a PRECONDITION of the state change, not an optional extra.
 */
function assertValidResolutionComment(comment) {
  if (isBlank(comment)) {
    throw new AppError(400, 'COMMENT_REQUIRED', 'A resolution comment is required to resolve a request.');
  }
  const clean = comment.trim();
  if (clean.length > MAX_COMMENT) {
    throw new AppError(400, 'COMMENT_TOO_LONG', `Resolution comment must be at most ${MAX_COMMENT} characters.`);
  }
  return clean;
}

/** Only Open / In Progress requests can move to Resolved. */
function assertResolvable(request) {
  if (request.status === 'Resolved') {
    throw new AppError(409, 'ALREADY_RESOLVED', 'This request is already resolved.');
  }
}

module.exports = { parseRequestId, validateNewRequest, assertValidResolutionComment, assertResolvable };
