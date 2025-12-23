// Reusable RBAC middleware: enforces that x-user-role matches allowed roles.
const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

function rbac(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.header("x-user-role");

    // Missing role header
    if (!role) {
      return res
        .status(403)
        .json({ error: "Role header (x-user-role) required" });
    }

    // Check allowed roles
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }

    next();
  };
}

module.exports = { rbac, ROLES };
