import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/workready';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB...');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      process.exit(0);
    }

    const bcrypt = await import('bcryptjs');
    const salt = bcrypt.default.genSaltSync(10);
    const hashedPassword = bcrypt.default.hashSync('adminpassword', salt);

    const id = 'usr-' + Math.floor(Math.random() * 10000);
    const newAdmin = await User.create({
      id,
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      fullname: 'System Administrator',
      email: 'admin@workready.ai',
      profile_completed: true
    });

    console.log('Successfully created admin user!');
    console.log('Username:', newAdmin.username);
    console.log('Password:', newAdmin.password);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin DB:', err);
    process.exit(1);
  }
};

seedAdmin();
