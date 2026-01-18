const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3000;

// Connect to database then start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`[SERVER] IMEER.ai Server running on http://localhost:${PORT}`)
  );
};

startServer();
