import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve .env from backend root regardless of execution cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables or .env file');
    }
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoUri);
    console.log(`[database] MongoDB connected successfully✅: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[database] MongoDB connection error❌: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

export default connectDB;

