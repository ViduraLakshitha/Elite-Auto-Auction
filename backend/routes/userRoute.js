import express from "express";
import { User } from "../model/userModel.js";
import { getAllUsers, getUserById, getUserByEmail, updateUser, deleteUser } from "../controllers/userController.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;// Get URL ID

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Route for user signup
router.post("/signup", async (req, res) => {
  try {
    const { fname, lname, address, country, email, mobileNo, password } = req.body;

    // Check if all required fields are present
    if (!fname || !lname || !address || !country || !email || !mobileNo || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      fname,
      lname,
      address,
      country,
      email,
      mobileNo,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Protected routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);//add new
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;