import {User} from "../model/userModel.js";

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find(); // Call on User model
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
}

// Get a single user by ID
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id); // Call on User model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
}

// Update a user's profile
export async function updateUser(req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Call on User model
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
}

// Delete a user
export async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id); // Call on User model
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
}
