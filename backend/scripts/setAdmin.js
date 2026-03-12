/**
 * One-time Admin Elevation Script
 * Run: node scripts/setAdmin.js
 *
 * This script:
 * 1. Connects to the MongoDB database
 * 2. Finds the user by email (pranavattarde720@gmail.com)
 * 3. Sets their role to 'admin'
 * 4. Optionally resets their password to a known value
 * 5. Disconnects
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const USER_EMAIL = 'pranavattarde720@gmail.com';
const NEW_PASSWORD = 'Admin@1234'; // Temporary password - change after login!

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleId: String,
  profileImage: String,
  role: { type: String, enum: ['admin', 'partner'], default: 'partner' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function setAdmin() {
  console.log('Connecting to MongoDB...');
  console.log('URI:', process.env.MONGODB_URI);
  
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!\n');

  let user = await User.findOne({ email: USER_EMAIL });

  if (!user) {
    console.log(`User ${USER_EMAIL} not found. Creating new admin account...`);
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(NEW_PASSWORD, salt);

    user = await User.create({
      name: 'Pranav Attarde',
      email: USER_EMAIL,
      password: hashed,
      role: 'admin',
    });
    console.log(`✅ Admin account created: ${USER_EMAIL}`);
    console.log(`   Temporary password: ${NEW_PASSWORD}`);
  } else {
    console.log(`Found user: ${user.email} (current role: ${user.role})`);

    // Elevate to admin
    user.role = 'admin';

    // Reset password so we know it works
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(NEW_PASSWORD, salt);

    await user.save({ validateBeforeSave: false });

    console.log(`\n✅ SUCCESS!`);
    console.log(`   Email: ${USER_EMAIL}`);
    console.log(`   Role:  admin`);
    console.log(`   Temp Password: ${NEW_PASSWORD}`);
    console.log(`\n   ⚠️  IMPORTANT: Change your password after login!`);
  }

  await mongoose.disconnect();
  console.log('\nDone! Database disconnected.');
}

setAdmin().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
