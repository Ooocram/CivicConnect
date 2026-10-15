// A business/validation error that carries its HTTP meaning.
// Lives in the Domain layer so every layer above can throw/handle it.
class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
module.exports = { AppError };
