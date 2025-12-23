// Core Express app wiring with shared rate limiting and RBAC-protected routes.
const express = require("express");
const rateLimit = require("../middleware/rateLimit.middleware");
const { rbac, ROLES } = require("../middleware/rbac.middleware");

const publicRoutes = require("../routes/public.routes");
const userRoutes = require("../routes/user.route");
const adminRoutes = require("../routes/admin.route");

const app = express();

// Instantiate rate limiter once so counters persist across requests.
const rateLimiter = rateLimit();

// Basic request parsing.
app.use(express.json());

// Apply rate limiting to all routes except /public (truly unrestricted).
app.use((req, res, next) => {
  if (req.path.startsWith("/public")) return next();
  return rateLimiter(req, res, next);
});

// Route registration
app.use("/public", publicRoutes); // no RBAC
app.use("/user", rbac([ROLES.ADMIN, ROLES.USER]), userRoutes);
app.use("/admin", rbac([ROLES.ADMIN]), adminRoutes);

module.exports = app;
