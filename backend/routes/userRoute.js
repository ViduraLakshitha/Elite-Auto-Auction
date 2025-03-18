import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js"; // Import named exports

const userRoute = express.Router();

// User profile management routes
userRoute.get("/", getAllUsers);
userRoute.get("/:id", getUserById);
userRoute.put("/:id", updateUser);
userRoute.delete("/:id", deleteUser);

export default userRoute; //  Correct default export
