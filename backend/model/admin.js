import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // For password hashing

const adminSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: true,
                  trim: true,
            },

            email: {
                  type: String,
                  required: true,
                  unique: true, // Ensures no duplicate emails
                  trim: true,
                  lowercase: true, // Consistent format
            },

            password: {
                  type: String,
                  required: true,
            },

            role: {
                  type: String,
                  enum: ["superadmin", "moderator", "editor"], // Example roles
                  default: "moderator",
            },
      },
      { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.model("Admin", adminSchema);
