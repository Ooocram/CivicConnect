require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

//Service Request Submission Endpoint
app.post("/api/v1/requests", async (req, res) => {
  try {
    const { title, description, categoryId, location } = req.body;

    // Basic Validation matching the API decision
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    // Placeholder for the ORM Transaction logic (to be fully implemented in Sprint 2)
    const mockTrackingId = `REQ-${Math.floor(Math.random() * 10000)}`;

    res.status(201).json({
      message: "Service request submitted successfully",
      trackingId: mockingTrackingId,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CivicConnect API running on port ${PORT}`);
});
