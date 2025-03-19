import dotenv from 'dotenv';
dotenv.config();

// MongoDB connection URL
export const mongoDBURL = process.env.MONGODB_URI || 'mongodb+srv://your_default_connection_string_here';

//Server port
export const PORT = 5555;

// JWT secret key
export const JWT_SECRET = process.env.JWT_SECRET
