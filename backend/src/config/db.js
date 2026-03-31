const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const options = {
    // Mongoose 8 handles connection pooling internally.
    // These are the only tuning knobs worth setting explicitly:
    serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] Connection failed: ${err.message}`);
    // Exit hard — app is useless without a DB
    process.exit(1);
  }
};

// Graceful disconnect (used in tests and clean shutdown)
const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('[DB] MongoDB disconnected');
};

module.exports = { connectDB, disconnectDB };
