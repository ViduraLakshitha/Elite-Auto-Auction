import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
      {
            fName: {
                  type: String,
                  required: true,
                  trim: true, // Removes extra spaces
            },


            lname: {
                type: String,
                required: true,
                trim: true,
            },

            address: {
                  type: String,
                  required: true,
            },

            country: {
                  type: String,
                  required: true,
            },

            email: {
                  type: String,
                  required: true,
                  unique: true, // Ensures no duplicate emails
                  lowercase: true,
                  trim: true,
                  validate: {
                        validator: function (value) {
                              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value); // Valid email regex
                        },
                        message: "Invalid email format",
                  },
            },

            mobileNo: {
                  type: String,
                  required: true,
                  validate: {
                        validator: function (value) {
                              return /^\+?[1-9]\d{1,14}$/.test(value); // E.164 phone number format
                        },
                        message: "Invalid phone number format",
                  },
            },

            password: {
                  type: String,
                  required: true,
                  minlength: [6, "Password must be at least 6 characters long"],
            },

            accountState: {
                  type: String,
                  enum: ["active", "suspended","pending"],
                  default: "pending",
            },

            isVerified: {
                type: Boolean,
                default: false,
            },

            successfulCompletedAuctions: { 
                  type: Number, 
                  default: 0,
            }, // For sellers
            
            winningBids: { //No.Of winning bids
                  type: Number, 
                  default: 0,
            }, // For buyers
      },
      { timestamps: true }
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next(); // Skip if password is unchanged

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
});

const User = mongoose.model("User", userSchema);

export default User;
