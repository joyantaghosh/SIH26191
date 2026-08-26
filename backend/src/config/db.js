import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[database] MongoDB connected successfully✅: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[database] MongoDB connection error❌: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

export default connectDB;
