// Builds the Express app WITHOUT listening, so Supertest can import it.
const express = require("express");
const cors = require("cors");
const requestRoutes = require("./presentation/request.routes");
const errorHandler = require("./presentation/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/requests", requestRoutes);

app.use(errorHandler); // must be last

module.exports = app;
