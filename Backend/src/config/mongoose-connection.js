const mongoose = require("mongoose");
const logger = require('./logger-config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URI);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("❌ MongoDB connection failed:");
    logger.error(error.message);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDB;
