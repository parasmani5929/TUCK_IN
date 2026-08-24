const { MongoClient } = require('mongodb');
const dns = require('dns');
if (!process.env.VERCEL) {
  dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix for local ISP DNS blocking
}
require('dotenv').config({ path: '../.env' });

let db;
let client;

let connectPromise;

async function connectDB() {
  if (connectPromise) return connectPromise;
  
  connectPromise = (async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    const dbName = process.env.MONGODB_DB || 'food_ordering';

    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB: ${dbName}`);
    return db;
  })();
  
  return connectPromise;
}

async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

module.exports = { connectDB, getDB };
