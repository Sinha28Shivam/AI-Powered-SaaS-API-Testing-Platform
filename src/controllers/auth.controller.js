import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/customError.js';

// Register a new user
export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return next(createError("All fields are required", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashedPassword });

        res.json({
            message: 'User registered successfully'
        });
    }catch(error) {
        next(createError(error.message, 500));
    }
};

// Login a user
export const login = async (req, res) => {
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        return res.send({ message: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        return res.send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        {
            id: user._id, 
            role: user.role
        },
        "secretkey"
    );

    res.json({ token });
    } catch(error) {
        next(createError(error.message, 500));
        }
};