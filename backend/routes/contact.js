const express = require("express");
const rateLimit = require("express-rate-limit");
const { submitContact } = require("../controllers/contactController");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many messages. Please try again later.",
  },
});

router.post("/", limiter, submitContact);

module.exports = router;