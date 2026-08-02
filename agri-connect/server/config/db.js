const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const uri = "mongodb+srv://harshit123412_db_user:qQqKKJI5Z6ukaKo2@cluster0.wyji4ds.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=Cluster0";
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
  console.error('❌ All MongoDB connection attempts failed. Server will continue without DB.');
};

module.exports = connectDB;

