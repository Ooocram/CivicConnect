// M4 scope closure: read, triage and management reporting.
// Public tracking lookup returns a minimal projection; staff-only views require JWT.
const { Op } = require('sequelize');
const { ServiceRequest, Category, Comment } = require('../persistence/models');
const { AppError } = require('../domain/errors');

function parseId(value) {
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request identifier.');
  }
  return Number(value);
}
function publicView(item) {
  return { trackingId: item.trackingId, title: item.title, status: item.status, createdAt: item.createdAt, updatedAt: item.updatedAt, resolvedAt: item.resolvedAt };
}
async function byTrackingId(value) {
  if (!/^REQ-[0-9A-F]{8}$/.test(value || '')) throw new AppError(400, 'VALIDATION_ERROR', 'Invalid tracking ID.');
  const item = await ServiceRequest.findOne({ where: { trackingId: value } });
  if (!item) throw new AppError(404, 'REQUEST_NOT_FOUND', 'Service request not found.');
  return publicView(item);
}
async function history(value) {
  if (!/^REQ-[0-9A-F]{8}$/.test(value || '')) throw new AppError(400, 'VALIDATION_ERROR', 'Invalid tracking ID.');
  const item = await ServiceRequest.findOne({ where: { trackingId: value }, include: [{ model: Comment, attributes: ['type', 'createdAt'], required: false }] });
  if (!item) throw new AppError(404, 'REQUEST_NOT_FOUND', 'Service request not found.');
  // Never expose staff IDs, resolution comments or internal DB IDs through a public token.
  return { ...publicView(item), events: [{ type: 'SUBMITTED', at: item.createdAt }, ...(item.resolvedAt ? [{ type: 'RESOLVED', at: item.resolvedAt }] : [])] };
}
async function listForStaff({ status, categoryId, assignedTo }) {
  const where = {};
  if (status !== undefined) {
    if (!['Open', 'In Progress', 'Resolved'].includes(status)) throw new AppError(400, 'VALIDATION_ERROR', 'Invalid status filter.');
    where.status = status;
  }
  if (categoryId !== undefined) where.categoryId = parseId(categoryId);
  if (assignedTo !== undefined) where.assignedTo = parseId(assignedTo);
  const rows = await ServiceRequest.findAll({ where, order: [['createdAt', 'DESC']], limit: 100, include: [{ model: Category, attributes: ['name'] }] });
  return rows;
}
async function assign({ requestId, staffUser }) {
  const id = parseId(requestId);
  return ServiceRequest.sequelize.transaction(async transaction => {
    const item = await ServiceRequest.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!item) throw new AppError(404, 'REQUEST_NOT_FOUND', 'Service request not found.');
    if (item.status === 'Resolved') throw new AppError(409, 'ALREADY_RESOLVED', 'Cannot assign a resolved request.');
    if (item.assignedTo && item.assignedTo !== staffUser.id) throw new AppError(409, 'ALREADY_ASSIGNED', 'Request is already assigned.');
    return item.update({ assignedTo: staffUser.id, status: 'In Progress' }, { transaction });
  });
}
async function summary() {
  const [open, inProgress, resolved] = await Promise.all(['Open', 'In Progress', 'Resolved'].map(status => ServiceRequest.count({ where: { status } })));
  // No SLA due-date baseline exists: do not fabricate an overdue count.
  return { open, inProgress, resolved, total: open + inProgress + resolved, overdue: null, overdueReason: 'SLA/due-date baseline not defined' };
}
module.exports = { byTrackingId, history, listForStaff, assign, summary };
