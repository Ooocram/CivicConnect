// src/presentation/error.middleware.js
// Central error mapping. Anything unexpected becomes a generic 500 so internals never leak.
const { AppError } = require('../domain/errors');

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  if (err.type === 'entity.parse.failed') { // malformed JSON body
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body is not valid JSON.' } });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') { // e.g. unknown categoryId
    return res.status(400).json({ error: { code: 'INVALID_REFERENCE', message: 'A referenced record does not exist.' } });
  }
  console.error(err); // transaction (if any) was already rolled back by Sequelize
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error.' } });
};
