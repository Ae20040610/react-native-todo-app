import mongoose from 'mongoose';

// Connects to MongoDB using the URI from .env
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('MongoDB connected');
};
