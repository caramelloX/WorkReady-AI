import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully!');

    const password = 'TestPassword123!';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const id = 'usr-' + Math.floor(Math.random() * 10000);
    const newUser = await User.create({ 
      id, 
      username: 'testuser' + Date.now(), 
      password: hashedPassword, 
      role: 'student', 
      fullname: 'Test User', 
      email: 'test@example.com', 
      target_track: '', 
      target_industry: '' 
    });
    console.log('[DEBUG] User successfully saved to MongoDB:', newUser);

  } catch (err) {
    console.error('[DEBUG] Registration database error:', err);
  } finally {
    mongoose.disconnect();
  }
};

run();
