// Builds the Express app WITHOUT listening, so Supertest can import it.
const express = require("express");
const cors = require("cors");
const requestRoutes = require("./presentation/request.routes");
const errorHandler = require("./presentation/error.middleware");

const app = express();
// Explicit browser origin allowlist. No wildcard CORS for authenticated endpoints.
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, origin || false);
    return callback(null, false); // deny CORS exposure without turning preflight into HTTP 500
  }
}));
app.use(express.json());

app.use("/api/v1/requests", requestRoutes);

app.use(errorHandler); // must be last

module.exports = app;
