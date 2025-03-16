import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg text-gray-800 mb-4"> Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first hear about new products, exclusive events and offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get your Dream Vehicle.
          </p>

          {/* Newsletter form */}

          <form className="flex">
            <input
              type="email"
              placeholder="Enter your Email."
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md foucs:outline-nune foucs:ring-2 foucs:ring-gray-500 transition-all"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Vehicles</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Lucxery Cars
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Clasic Cars
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Common Cars
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                About Us
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                FAQs
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us */}

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Vehicles</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Lucxery Cars
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Clasic Cars
              </Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">
                Common Cars
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
