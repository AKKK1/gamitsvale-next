import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

// Global cache — Vercel serverless-ზე ყოველ request-ზე ახალი connection არ შეიქმნება
let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,           // max 10 parallel connection
      minPoolSize: 2,            // min 2 ყოველთვის ღია
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}