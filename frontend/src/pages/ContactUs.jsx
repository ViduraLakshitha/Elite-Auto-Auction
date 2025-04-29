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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-16 flex-grow">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">Contact Our Team</h1>
          <div className="h-1 w-24 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about our premium vehicle auctions? Our concierge team is ready to assist you with any inquiries.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 font-serif">Our Information</h2>
            <div className="h-1 w-16 bg-amber-500 mb-6"></div>
            <div className="space-y-6 text-gray-600">
              <div className="flex items-start">
                <span className="text-amber-500 mr-4 text-xl">📍</span>
                <div>
                  <p className="font-medium text-gray-800">Address</p>
                  <p>123 Luxury Cars St, New York, USA</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-amber-500 mr-4 text-xl">📧</span>
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p>support@eliteautoauction.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-amber-500 mr-4 text-xl">📞</span>
                <div>
                  <p className="font-medium text-gray-800">Phone</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 font-serif">Send Us a Message</h2>
            <div className="h-1 w-16 bg-amber-500 mb-6"></div>
            {status && (
              <div className={`mb-6 p-4 rounded ${status.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;