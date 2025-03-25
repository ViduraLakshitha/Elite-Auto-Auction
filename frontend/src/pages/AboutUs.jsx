import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/footer";

const AboutUs = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto my-10 px-6">
        <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
        <p className="text-lg text-gray-700 text-center mb-10">
          Welcome to our premium vehicle auction platform! We specialize in bringing you the best luxury and classic cars from trusted sellers worldwide. Our mission is to provide a secure, transparent, and engaging auction experience for both buyers and sellers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-gray-600">
              Our goal is to redefine online vehicle auctions by ensuring trust, ease, and accessibility for all users. We continuously enhance our platform to provide an unparalleled experience.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Why Choose Us?</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Real-time live bidding for seamless auctions</li>
              <li>AI-powered recommendation system for personalized searches</li>
              <li>Secure payment processing via PayPal & Stripe</li>
              <li>Detailed vehicle history reports for every listing</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>
          <p className="text-gray-700">
            Have any questions? Feel free to <a href="/contact" className="text-blue-500 font-semibold">Contact Us</a> anytime!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
