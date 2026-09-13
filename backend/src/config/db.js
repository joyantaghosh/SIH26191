import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.8.4']);
} catch (_) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve .env from backend root regardless of execution cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let memServer = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    if (!mongoUri && process.env.NODE_ENV !== 'test') {
      throw new Error('MONGO_URI is not defined in environment variables or .env file');
    }

    mongoose.set('strictQuery', false);

    if (mongoUri && process.env.USE_MEMORY_DB !== 'true') {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 6000,
      });
      console.log(`[database] MongoDB Atlas connected successfully✅: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.warn(`[database] Primary MongoDB connection error: ${error.message}`);
    console.warn(`[database] Tip: In MongoDB Atlas Dashboard, ensure current IP is whitelisted (Network Access -> 0.0.0.0/0).`);
  }

  // Graceful fallback to in-memory MongoDB for local development/testing
  try {
    console.log('[database] Initializing local in-memory MongoDB fallback...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memServer = await MongoMemoryServer.create();
    const memUri = memServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[database] Connected to In-Memory MongoDB successfully✅: ${memUri}`);
    return conn;
  } catch (memError) {
    console.error(`[database] In-memory MongoDB failed❌: ${memError.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  if (memServer) {
    await memServer.stop();
  }
};

export default connectDB;


