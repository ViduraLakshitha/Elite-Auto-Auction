import React from "react";
import { Link } from "react-router";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FaAward, FaCar, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-amber-500/20 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Newsletter Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <FaAward className="text-amber-500 mr-2" />
              <h3 className="text-xl font-serif font-medium text-white">Exclusive Updates</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Join our privileged circle to receive first access to rare vehicle acquisitions and invitation-only events.
            </p>
            
            {/* Newsletter form */}
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your esteemed email"
                className="p-3 w-full bg-gray-800 border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder-gray-500 text-white"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center"
              >
                <span>Become an Insider</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>

          {/* Vehicle Collection */}
          <div>
            <div className="flex items-center mb-6">
              <FaCar className="text-amber-500 mr-2" />
              <h3 className="text-xl font-serif font-medium text-white">Curated Collections</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-2 h-0.5 bg-amber-500 mr-3 transform group-hover:w-4 transition-all duration-300"></span>
                  Investment-Grade Classics
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-2 h-0.5 bg-amber-500 mr-3 transform group-hover:w-4 transition-all duration-300"></span>
                  Limited Edition Supercars
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-2 h-0.5 bg-amber-500 mr-3 transform group-hover:w-4 transition-all duration-300"></span>
                  Bespoke Luxury Vehicles
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center group">
                  <span className="w-2 h-0.5 bg-amber-500 mr-3 transform group-hover:w-4 transition-all duration-300"></span>
                  Historic Racing Machines
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge Services */}
          <div>
            <h3 className="text-xl font-serif font-medium text-white mb-6 flex items-center">
              <svg className="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Concierge Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center">
                  <span className="text-amber-500 mr-2">↳</span>
                  Private Acquisition Consultations
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center">
                  <span className="text-amber-500 mr-2">↳</span>
                  Worldwide Vehicle Transport
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center">
                  <span className="text-amber-500 mr-2">↳</span>
                  Collector Portfolio Management
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-400 transition-colors flex items-center">
                  <span className="text-amber-500 mr-2">↳</span>
                  VIP Event Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-serif font-medium text-white mb-6">Global Headquarters</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-400">
                  1 Rodeo Drive<br />
                  Beverly Hills, CA 90210<br />
                  United States
                </p>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-amber-500 mr-3" />
                <p className="text-gray-400">+1 (310) 555-ELITE</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-white font-medium mb-4">Follow Our Gallery</h4>
              <div className="flex space-x-5">
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <IoLogoInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <IoLogoFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <RiTwitterXLine className="h-5 w-5 mt-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link to="#" className="text-gray-500 hover:text-amber-400 text-xs uppercase tracking-widest transition-colors">
                Privacy Protocol
              </Link>
              <Link to="#" className="text-gray-500 hover:text-amber-400 text-xs uppercase tracking-widest transition-colors">
                Terms of Acquisition
              </Link>
              <Link to="#" className="text-gray-500 hover:text-amber-400 text-xs uppercase tracking-widest transition-colors">
                Authentication
              </Link>
            </div>
            <p className="text-gray-600 text-sm tracking-wider">
              © 2025 ELITE AUTO GALLERIES. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;