// src/application/events.js
// ADR-02 (Observer): in-process event bus. Services publish; audit-log and
// notification consumers subscribe later without the service knowing about them.
const { EventEmitter } = require('events');
module.exports = new EventEmitter();
