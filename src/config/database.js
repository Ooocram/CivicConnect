// Single source of DB configuration for BOTH the app and sequelize-cli.
// Credentials come only from environment variables (RSK-06).
require("dotenv").config({ quiet: true });

module.exports = {
  development: { use_env_variable: "DATABASE_URL", dialect: "postgres" },
  test: { use_env_variable: "TEST_DATABASE_URL", dialect: "postgres" },
  production: { use_env_variable: "DATABASE_URL", dialect: "postgres" },
};
