import {User} from "../model/userModel.js";
import {Admin} from "../model/admin.js";

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password"); // Exclude password
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      { name, email},
      { new: true } // Return the updated document
    ).select("-password"); // Exclude password

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Delete a user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};