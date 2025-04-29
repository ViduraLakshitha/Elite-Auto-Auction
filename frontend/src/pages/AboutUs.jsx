import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-16 flex-grow">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">About Our Auction House</h1>
          <div className="h-1 w-24 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Welcome to our premium vehicle auction platform where elegance meets performance. 
            We specialize in bringing you the finest luxury and classic cars from trusted sellers worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-28 max-w-6xl mx-auto">
          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 font-serif">Our Mission</h2>
            <div className="h-1 w-16 bg-amber-500 mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              Our goal is to redefine online vehicle auctions by ensuring trust, ease, and accessibility for all users. 
              We continuously enhance our platform to provide an unparalleled experience that matches the excellence 
              of the vehicles we showcase.
            </p>
          </div>

          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 font-serif">Why Choose Us?</h2>
            <div className="h-1 w-16 bg-amber-500 mb-6"></div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">✓</span>
                <span>Real-time live bidding for seamless auctions</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">✓</span>
                <span>AI-powered recommendation system for personalized searches</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">✓</span>
                <span>Secure payment processing via PayPal & Stripe</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">✓</span>
                <span>Detailed vehicle history reports for every listing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-gray-900 to-gray-800 p-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-white font-serif">Experience the Difference</h2>
          <div className="h-1 w-16 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Have questions about our auction process or need assistance with a vehicle?
            Our concierge team is ready to provide white-glove service.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded transition duration-300"
          >
            Contact Our Specialists
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;