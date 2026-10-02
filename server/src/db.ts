import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { seedDatabase } from './seed';

let mongod: MongoMemoryServer;

export async function connectDB(): Promise<void> {
  try {
    console.log('🔌 Starting in-memory MongoDB...');
    mongod = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 },
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected (in-memory)');
    await seedDatabase();
    console.log('🌱 Database seeded successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
