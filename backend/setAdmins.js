import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const emailsToAdmin = [
  'rahilbharara16@gmail.com',
  'pranavattarde720@gmail.com'
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');
        
        for (const email of emailsToAdmin) {
            const user = await User.findOne({ email });
            if (user) {
                user.role = 'admin';
                await user.save();
                console.log(`Updated user ${email} to admin.`);
            } else {
                console.log(`User ${email} not found in database.`);
            }
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
