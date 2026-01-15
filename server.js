const app = require('./app');
// Random comment 2: Database configuration
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3000;

// Connect to database then start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`🚀 IMEER.ai Server running on http://localhost:${PORT}`)
  );
};

startServer();
