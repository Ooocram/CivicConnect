// src/persistence/comment.repository.js
const { Comment } = require('./models');

/** FR-04 write #2: runs in the SAME transaction as the status update. */
function createResolutionComment({ requestId, authorId, body }, transaction) {
  return Comment.create({ requestId, authorId, body, type: 'RESOLUTION' }, { transaction });
}

module.exports = { createResolutionComment };
