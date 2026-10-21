import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<void> {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI is unset; authentication is unavailable.');
    return;
  }

  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.info('MongoDB connected.');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

export function databaseStatus(): string {
  return ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] ?? 'unknown';
}

export function requireDatabase(): void {
  if (mongoose.connection.readyState !== 1) throw new Error('AUTH_UNAVAILABLE');
}
