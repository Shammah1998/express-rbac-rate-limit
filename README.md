## RBAC & Rate Limiting – Node.js Express

Small Express app that demonstrates role-based access control (RBAC) and a fixed-window rate limiter. It is intentionally header-only: clients send `x-user-id` for rate limiting and `x-user-role` for RBAC—no authentication or JWTs.

### Features
- Fixed-window per-user rate limiting (default: 10 requests per minute) via `x-user-id`.
- RBAC middleware with two roles: `ADMIN` and `USER`.
- Endpoints:
  - `GET /public` – open; no RBAC or rate limiting.
  - `GET /user/data` – requires `USER` or `ADMIN`; rate limited.
  - `GET /admin/data` – requires `ADMIN`; rate limited.

### Project Structure
- `server/src/server.js` – entrypoint; starts Express.
- `server/src/app.js` – wires middleware and routes; skips rate limiting for `/public`.
- `server/middleware/rateLimit.middleware.js` – fixed-window limiter keyed by `x-user-id`.
- `server/middleware/rbac.middleware.js` – RBAC middleware and role constants.
- `server/routes/*.route.js` – public, user, and admin route handlers.

### Run Locally
Prereqs: Node.js 18+ and npm.

1) Install dependencies  
```bash
npm install
```
2) Start the API (defaults to port 3000)  
```bash
npm start
```
   - Change the port with `PORT=4000 npm start`.

### Call the API
- Public (no headers needed):  
```bash
curl http://localhost:3000/public
```
- User data (role + user id required):  
```bash
curl -H "x-user-id: u1" -H "x-user-role: USER" http://localhost:3000/user/data
```
- Admin data:  
```bash
curl -H "x-user-id: admin1" -H "x-user-role: ADMIN" http://localhost:3000/admin/data
```

### Behavior Notes
- Rate limiting is implemented as a single in-memory middleware instance shared by all requests in the process (per-user counters are stored in memory).
- Missing `x-user-id` on rate-limited routes returns `400`; exceeding the window returns `429`.
- Missing or insufficient `x-user-role` returns `403`.
- In-memory counters reset when the server restarts.
