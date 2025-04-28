import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Check if token starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // Extract token from 'Bearer <token>'
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded); // Debug log
            
            // Add user info to request
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Authentication error", error: error.message });
    }
};
