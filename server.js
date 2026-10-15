// server.js  (repo root)
// Bootstrap only: load env, fail fast on missing secrets, start listening.
// All routing/logic now lives under src/ (layered architecture, PED v2.0 section 1.2).
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set (see .env.example).');
}

const app = require('./src/app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CivicConnect API running on port ${PORT}`);
});
