const express = require("express");
const router = express.Router();

router.get(
  "/data",
  (req, res) => {
    res.json({
      message: "Admin data",
    });
  }
);

module.exports = router;
