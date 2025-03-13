import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
      {
            category: {
                  type: String,
                  enum: ["Financial", "User Activity", "Auction Summary", "Other"], // Restrict valid categories
                  required: true,
            },

            generatedDateTime: {
                  type: Date,
                  default: Date.now, // Automatically set when created
            },

            docURL: {
                  type: String,
                  required: true,
                  validate: {
                        validator: function (value) {
                              return /^(https?:\/\/[^\s]+$)/.test(value); // Ensures it's a valid URL
                        },
                        message: "Invalid document URL format",
                  },
            },
      },
      { timestamps: true }
);

export const ReportCollection = mongoose.model("ReportCollection", reportSchema);
