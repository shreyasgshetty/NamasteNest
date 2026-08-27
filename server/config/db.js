const mongoose = require('mongoose');
const dns = require('dns');

// Fallback to Google DNS to avoid local ISP DNS SRV resolution failures
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS servers cannot be set
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Tip: Verify your MONGO_URI in server/.env, ensure your MongoDB Atlas cluster is active (not paused), and check Network Access (0.0.0.0/0).');
    process.exit(1);
  }
};

module.exports = connectDB;

