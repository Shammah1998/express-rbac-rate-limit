// Application entrypoint: boot the Express app and start listening for requests.
const app = require("./app");

// Allow overriding the port via env; fall back to a sensible default for local dev.
const PORT = process.env.PORT || 3000;

// Start the HTTP server.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});