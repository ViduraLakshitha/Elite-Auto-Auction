import express from "express";
import Contact from "../model/contact.model.js"; // fixed import

const contact = express.Router();

contact.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default contact;
