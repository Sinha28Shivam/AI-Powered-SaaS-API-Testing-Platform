import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {
        type: String,
        default: "tester" // admin / tester
    },
    plan: {
        type: String,
        default: "free"
    }
});

export default mongoose.model('User', userSchema);