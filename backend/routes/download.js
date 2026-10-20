
const express = require("express");
const archiver = require("archiver");

const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="amey-mali-portfolio.zip"'
  );

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.on("error", (err) => {
    console.error("ZIP generation failed:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Unable to generate ZIP file" });
    } else {
      res.destroy(err);
    }
  });

  archive.pipe(res);

  // Move your existing archive.append(...) statements here.
  // Keep their file contents and archive paths unchanged.

  archive.finalize();
});

module.exports = router;