import React, { useState } from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5555/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear form
      } else {
        setStatus(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <>
    <Header />
     <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Us</h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
        {/* Contact Information */}
        <div className="w-full md:w-1/3 p-6 border border-gray-200 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Our Information</h3>
          <p className="text-gray-700 mb-2">
            📍 <strong>Address:</strong> 123 Luxury Cars St, New York, USA
          </p>
          <p className="text-gray-700 mb-2">
            📧 <strong>Email:</strong> support@eliteautoauction.com
          </p>
          <p className="text-gray-700">
            📞 <strong>Phone:</strong> +1 (555) 123-4567
          </p>
        </div>
    <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        {status && <p className="text-red-500">{status}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send Message
          </button>
        </form>
      </div>
      </div>
      </div>
      <Footer />
      </>
  );
};

export default ContactUs;
