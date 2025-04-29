// backend/model/contact.model.js

import mongoose from "mongoose"; // ← this line must be at the top

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
