// APPLICATION LAYER: use cases + transaction boundaries ("Service-Layer ORM Transactions").
const crypto = require("crypto");
const { sequelize, Sequelize } = require("../persistence/models");
const requestRepo = require("../persistence/request.repository");
const commentRepo = require("../persistence/comment.repository");
const events = require("./events");
const { AppError } = require("../domain/errors");
const {
  parseRequestId,
  validateNewRequest,
  assertValidResolutionComment,
  assertResolvable,
} = require("../domain/serviceRequest.rules");

// ---- RSK-05 mitigation: retry on deadlock / serialisation failure -----------
const MAX_ATTEMPTS = 3;
const RETRYABLE = new Set(["40P01", "40001"]); // deadlock_detected, serialization_failure

/** Re-runs the WHOLE transaction when Postgres aborts it. Business errors are never retried. */
async function withRetry(fn) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const code = err.original && err.original.code;
      if (!RETRYABLE.has(code) || attempt >= MAX_ATTEMPTS) throw err;
      await new Promise((r) => setTimeout(r, 25 * 2 ** attempt)); // short exponential backoff
    }
  }
}

/**
 * FR-01: create a service request and return it (with its Tracking ID).
 * Validation runs BEFORE a transaction is opened, so bad input never holds a connection.
 */
async function createRequest(body) {
  const data = validateNewRequest(body);
  const trackingId = `REQ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  return sequelize.transaction((t) =>
    requestRepo.create({ ...data, trackingId, status: "Open" }, t),
  );
}

/**
 * FR-04: resolve a request and record the mandatory comment ATOMICALLY.
 *
 * ATOMICITY: managed transaction. If the callback throws anywhere (not found,
 * already resolved, comment insert fails, DB error) Sequelize ROLLS BACK both
 * writes; if it returns, both COMMIT. A half-applied state is impossible.
 * ISOLATION: READ COMMITTED + row lock (FOR UPDATE) serialises concurrent resolves.
 */
async function resolveRequest({ requestId, staffUser, comment }) {
  const id = parseRequestId(requestId);
  const cleanComment = assertValidResolutionComment(comment);

  const result = await withRetry(() =>
    sequelize.transaction(
      { isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const request = await requestRepo.findByIdForUpdate(id, t);
        if (!request)
          throw new AppError(
            404,
            "REQUEST_NOT_FOUND",
            "Service request not found.",
          );
        assertResolvable(request);

        const updated = await requestRepo.markResolved(
          request,
          staffUser.id,
          t,
        ); // write 1
        const savedComment = await commentRepo.createResolutionComment(
          // write 2
          { requestId: updated.id, authorId: staffUser.id, body: cleanComment },
          t,
        );
        return { request: updated, comment: savedComment };
      },
    ),
  );

  // ADR-02: publish ONLY after commit, so nobody is told about a resolution that
  // later rolled back. A listener failure must not undo or fail the committed work.
  try {
    events.emit("request.resolved", {
      requestId: result.request.id,
      resolvedBy: staffUser.id,
      commentId: result.comment.id,
    });
  } catch (e) {
    console.error("request.resolved listener failed:", e);
  }

  return result;
}

module.exports = { createRequest, resolveRequest };
