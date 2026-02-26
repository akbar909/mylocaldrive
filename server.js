const app = require('./app');
const connectDB = require('./config/db');

// ========== VERCEL SERVERLESS ==========
if (process.env.VERCEL) {
  // Lazy DB connection for serverless cold starts
  let dbConnected = false;
  const ensureDb = async () => {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
  };

  // Export a handler that connects to DB before passing to Express
  module.exports = async (req, res) => {
    await ensureDb();
    return app(req, res);
  };
} else {
  // ========== LOCAL / TRADITIONAL SERVER ==========
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }

  const validEnvs = ['development', 'production', 'staging'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    console.error(`❌ Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: ${validEnvs.join(', ')}`);
    process.exit(1);
  }

  const PORT = process.env.PORT || 3000;

  const startServer = async () => {
    try {
      await connectDB();
      
      const server = app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════╗
║   IMEER.ai Cloud Storage Server           ║
║   Environment: ${process.env.NODE_ENV.padEnd(27)}║
║   Port: ${PORT.toString().padEnd(33)} ║
║   Security: ✓ Enabled                     ║
╚═══════════════════════════════════════════╝
        `);
      });

      process.on('SIGTERM', () => {
        console.log('⚠️  SIGTERM received. Shutting down gracefully...');
        server.close(() => {
          console.log('✓ Server closed');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        console.log('⚠️  SIGINT received. Shutting down gracefully...');
        server.close(() => {
          console.log('✓ Server closed');
          process.exit(0);
        });
      });

    } catch (err) {
      console.error('❌ Failed to start server:', err.message);
      process.exit(1);
    }
  };

  startServer();
}
