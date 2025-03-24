import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fname: {
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

    isVerified: {
      type: Boolean,
      default: false, // User is not verified by default
    },

    verificationToken: {
      type: String,
      default: null, // Token for email verification
    },

    accountState: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "pending",
    },

    successfulCompletedAuctions: {
      type: Number,
      default: 0,
    },

    winningBids: {
      type: Number,
      default: 0,
    },

    sellerRank: {
      type: Number,
      default: 1,
    },
    sellerAward: {
      type: String,
      enum: ["Gold", "Silver", "Bronze", "None"],
      default: "None",
    },
    // Buyer scoreboard fields
    buyerRank: {
      type: Number,
      default: 1,
    },
    buyerAward: {
      type: String,
      enum: ["Gold", "Silver", "Bronze", "None"],
      default: "None",
    },
  },
  { timestamps: true }
);

// Calculate sellerAward and buyerAward before saving
userSchema.pre("save", function (next) {
  // Calculate sellerAward
  if (this.successfulCompletedAuctions >= 20) {
    this.sellerAward = "Gold";
  } else if (this.successfulCompletedAuctions >= 10) {
    this.sellerAward = "Silver";
  } else if (this.successfulCompletedAuctions >= 5) {
    this.sellerAward = "Bronze";
  } else {
    this.sellerAward = "None";
  }

  // Calculate buyerAward
  if (this.winningBids >= 20) {
    this.buyerAward = "Gold";
  } else if (this.winningBids >= 10) {
    this.buyerAward = "Silver";
  } else if (this.winningBids >= 5) {
    this.buyerAward = "Bronze";
  } else {
    this.buyerAward = "None";
  }

  next();
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is unchanged

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.index({ successfulCompletedAuctions: -1 });
userSchema.index({ winningBids: -1 });

export const User = mongoose.model("User", userSchema);

// export const User = mongoose.model("User", userSchema);
