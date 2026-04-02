import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { env } from './src/config/env.js';

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(env.MONGO_URI);
        const email = 'admin@company.com';
        const passwordHash = await bcrypt.hash('admin123', 10);

        let admin = await User.findOne({ email });
        if (admin) {
            console.log("Admin already exists!");
        } else {
            await User.create({ email: email, password: passwordHash, role: 'admin' });
            console.log("\n=================================");
            console.log("✅ Admin account created successfully!");
            console.log("Email: admin@company.com");
            console.log("Password: admin123");
            console.log("=================================\n");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
createAdmin();
