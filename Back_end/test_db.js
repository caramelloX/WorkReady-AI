import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(`Testing connection to Atlas...`);
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully!');

    // Add student
    const username = 'student01';
    const password = 'studentpassword';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`User ${username} already exists.`);
    } else {
      const newUser = await User.create({
        id: `usr-${Date.now()}`,
        username,
        password: hashedPassword,
        role: 'student',
        fullname: 'Demo Student',
        email: 'student01@example.com'
      });
      console.log(`Added student successfully!`);
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${newUser.role}`);
    }

  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    mongoose.disconnect();
  }
};

run();
