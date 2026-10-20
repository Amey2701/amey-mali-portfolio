
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contact");

const app = express();

const PORT = process.env.PORT || 5001;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected",
  });
});

app.use("/api/contact", contactRoutes);

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Accepting requests from ${FRONTEND_URL}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
