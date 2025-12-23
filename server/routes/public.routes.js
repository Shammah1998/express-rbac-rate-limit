// Public routes: no RBAC needed.
const express = require("express");

const router = express.Router();

// GET /public
// Accessible to anyone; useful for health checks or public data.
router.get("/", (req, res) => {
  res.json({ message: "Public endpoint accessible to everyone" });
});

module.exports = router;



// no rate limiting 
