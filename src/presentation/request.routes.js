// src/presentation/request.routes.js
const router = require('express').Router();
const controller = require('./request.controller');
const { requireAuth, requireRole } = require('./auth.middleware');

// FR-01 (Golden Trace). Public, as in M2.
router.post('/', controller.create);

// FR-04. Staff only: 401 if unauthenticated, 403 if not staff.
router.put('/:id/resolve', requireAuth, requireRole('staff'), controller.resolve);

module.exports = router;
