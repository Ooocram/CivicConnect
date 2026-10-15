// src/presentation/request.controller.js
// PRESENTATION LAYER: HTTP concerns only (read input, call service, shape response).
// No business rules and no DB access here (layering constraint).
const requestService = require('../application/request.service');

/** POST /api/v1/requests  (FR-01). Response shape matches the M2 Golden Trace. */
async function create(req, res, next) {
  try {
    const created = await requestService.createRequest(req.body);
    res.status(201).json({
      message: 'Service request submitted successfully',
      trackingId: created.trackingId,
    });
  } catch (err) {
    next(err);
  }
}

/** PUT /api/v1/requests/:id/resolve  (FR-04). */
async function resolve(req, res, next) {
  try {
    const result = await requestService.resolveRequest({
      requestId: req.params.id,
      staffUser: req.user,
      comment: req.body && req.body.comment,
    });
    res.status(200).json({
      message: 'Service request resolved',
      data: { request: result.request, resolutionComment: result.comment },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, resolve };
