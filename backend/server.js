// Load environment variables first — before anything else imports process.env
require('dotenv').config();

const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { startCertificateWorker } = require('./src/workers/certificate.worker');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB before accepting requests
  await connectDB();

  // Start background workers (Redis optional — skips gracefully if not running)
  try {
    startCertificateWorker();
  } catch (err) {
    console.warn('[Server] Certificate worker not started (Redis unavailable):', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`[Server] Saathi API running on port ${PORT} (${process.env.NODE_ENV})`);
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  // On SIGTERM/SIGINT (Docker stop, Ctrl+C, process manager):
  // 1. Stop accepting new connections
  // 2. Finish in-flight requests
  // 3. Close DB connection
  // 4. Exit cleanly
  const shutdown = async (signal) => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      const { disconnectDB } = require('./src/config/db');
      await disconnectDB();
      console.log('[Server] Shutdown complete.');
      process.exit(0);
    });

    // Force-kill after 10s if graceful shutdown hangs
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ── Unhandled Rejections ───────────────────────────────────────────────────
  // Catch any promise rejections that slipped through asyncHandler
  process.on('unhandledRejection', (err) => {
    console.error('[Server] Unhandled Rejection:', err.message);
    shutdown('unhandledRejection');
  });
};

startServer();
