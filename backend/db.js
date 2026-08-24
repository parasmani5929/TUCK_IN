const { MongoClient } = require('mongodb');
const dns = require('dns');
if (!process.env.VERCEL) {
  dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix for local ISP DNS blocking
}
require('dotenv').config({ path: '../.env' });

let cachedClient = null;
let cachedDb = null;

async function getDB() {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB || 'food_ordering';

  const client = new MongoClient(uri, { 
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
  });
  
  try {
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(dbName);
    console.log(`✅ Connected to MongoDB: ${dbName}`);
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    cachedClient = null;
    cachedDb = null;
    throw err;
  }
}

// Keep connectDB alias for backward compatibility with server.js
module.exports = { connectDB: getDB, getDB };
