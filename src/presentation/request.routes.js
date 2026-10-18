// src/presentation/request.routes.js
const router = require('express').Router();
const controller = require('./request.controller');
const { requireAuth, requireRole } = require('./auth.middleware');
const { rateLimit } = require('./request.rate-limit');

// FR-01 (Golden Trace). Public, as in M2.
router.post('/', rateLimit, controller.create);

// FR-02: public tracking-token lookup with redacted responses.
router.get('/track/:trackingId', controller.track);
router.get('/track/:trackingId/history', controller.history);

// FR-03/FR-05: authenticated staff triage and management reporting.
router.get('/management/summary', requireAuth, requireRole('staff'), controller.summary);
router.get('/', requireAuth, requireRole('staff'), controller.list);
router.put('/:id/assign', requireAuth, requireRole('staff'), controller.assign);

// FR-04. Staff only: 401 if unauthenticated, 403 if not staff.
router.put('/:id/resolve', requireAuth, requireRole('staff'), controller.resolve);

module.exports = router;
