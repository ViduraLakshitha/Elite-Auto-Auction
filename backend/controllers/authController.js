import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../model/userModel.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";



dotenv.config();

// Signup
export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobileNo, country, address } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password || !mobileNo || !country || !address) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Create new user
        const newUser = new User({ firstName, lastName, email, password, mobileNo, country, address });
        await newUser.save();

        // Generate email verification token
        const verificationToken = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update user with the token
        newUser.verificationToken = verificationToken;
        await newUser.save();

        // Send verification email (Await to handle errors properly)
        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({ message: "User registered successfully. Please verify your email." });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


// Email Verification
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by email
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ error: "Invalid token or user not found" });
        }

        if (user.verified) {
            return res.status(400).json({ message: "Email is already verified." });
        }

        // Mark user as verified
        user.verified = true;
        user.verificationToken = null;
        await user.save();

        // Redirect to a success page
        res.redirect("http://localhost:5173/verification-success");  // Adjust URL as needed
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(400).json({ error: "Invalid or expired token" });
    }
};


// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If no user or incorrect password, return an error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // If the user's email is not verified, return an error
        if (!user.verified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        // Generate the JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Send the response with token and success message
        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);  // Log the error for debugging

        // Send a generic error message to the client
        res.status(500).json({ message: "Server error" });
    }
};

