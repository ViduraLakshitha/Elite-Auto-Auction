import express from 'express';
import {User} from '../model/userModel.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js"; // Import named exports


const router = express.Router();

// Route for user signup
router.post('/signup', async (req, res) => {
    try {
        const { fName, lname, address, country, email, mobileNo, password } = req.body;

        // Check if all required fields are present
        if (!fName || !lname || !address || !country || !email || !mobileNo || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new user
        const newUser = new User({
            fName,
            lname,
            address,
            country,
            email,
            mobileNo,
            password
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;








 

