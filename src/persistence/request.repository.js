// PERSISTENCE LAYER. Every method takes `transaction` so the SERVICE decides
// the atomic boundary; repositories never open or commit transactions themselves.
const { ServiceRequest } = require("./models");

/** FR-01: insert a new request inside the caller's transaction. */
function create(data, transaction) {
  return ServiceRequest.create(data, { transaction });
}

/**
 * Loads a request with a row lock (SELECT ... FOR UPDATE).
 * Two staff resolving the same ticket at once are serialised: the second waits,
 * then sees status = 'Resolved' and gets 409 instead of a duplicate comment.
 * This is part of the RSK-05 mitigation (concurrent status updates).
 */
function findByIdForUpdate(id, transaction) {
  return ServiceRequest.findByPk(id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
}

/** FR-04 write #1. */
function markResolved(request, staffId, transaction) {
  return request.update(
    { status: "Resolved", resolvedAt: new Date(), resolvedBy: staffId },
    { transaction },
  );
}

module.exports = { create, findByIdForUpdate, markResolved };
