// src/presentation/auth.middleware.js
// PRESENTATION LAYER. Minimal stateless JWT authentication + role check so that
// "Staff must ..." (FR-04) is enforceable. See ADR-05 in the notes.
// Verification pins HS256 so a token cannot pick a weaker/"none" algorithm.
const jwt = require('jsonwebtoken');
const { AppError } = require('../domain/errors');

function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required.'));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = { id: payload.uid, role: payload.role };
    return next();
  } catch {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Invalid or expired token.'));
  }
}

/** Authorisation (Assignment 3 STRIDE table: RBAC enforced server-side, 403 otherwise). */
const requireRole = (role) => (req, res, next) =>
  req.user && req.user.role === role
    ? next()
    : next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'));

module.exports = { requireAuth, requireRole };
