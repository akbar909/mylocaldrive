
// Import configured Express application
const app = require('./app');
const PORT = process.env.PORT || 3000;
// Start server and listen for incoming connections
app.listen(PORT, () =>
  console.log(`🚀 IMEER.ai Server running on http://localhost:${PORT}`)
);
