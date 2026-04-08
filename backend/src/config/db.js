const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables.
 * Logs connection status and exits process on failure.
 * Input: none (reads from process.env.MONGODB_URI)
 * Output: mongoose connection instance
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
