import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
  FaArrowLeft,
  FaTrophy,
  FaAward,
  FaEdit, // Import the edit icon
} from "react-icons/fa";

const UserDetailsPage = () => {
  // const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
      fname: "",
      lname: "",
      email: "",
      address: "",
      country: "",
      mobileNo: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/user/`);
        setUser(response.data);
      } catch (error) {
        setError("Error fetching user details. Please try again later.");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-6">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-blue-200 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center mb-6 text-blue-500 hover:text-blue-600"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>

        {/* Edit Button */}
        {/* <button
          onClick={() => navigate(`/user/${id}/edit`)} // Navigate to the edit page
          className="flex items-center mb-6 text-blue-500 hover:text-blue-600"
        >
          <FaEdit className="mr-2" /> Edit User
        </button> */}

        {/* User Details */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center">
            <FaUser className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {user.fname} {user.lname}
            </p>
          </div>

          {/* Email */}
          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>

          {/* Address */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {user.address}
            </p>
          </div>

          {/* Country */}
          <div className="flex items-center">
            <FaGlobe className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Country:</span> {user.country}
            </p>
          </div>

          {/* Mobile Number */}
          <div className="flex items-center">
            <FaPhone className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Mobile No:</span> {user.mobileNo}
            </p>
          </div>

          {/* Account State */}
          <div className="flex items-center">
            <p className="text-gray-700">
              <span className="font-semibold">Account State:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.accountState === "active"
                    ? "bg-green-100 text-green-700"
                    : user.accountState === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.accountState}
              </span>
            </p>
          </div>
          
        {/* Edit Button */}
        <button
          onClick={() => navigate(`/user/${id}/edit`)} // Navigate to the edit page
          className="flex items-center mb-6 text-blue-500 hover:text-blue-600 align-center"
        >
          <FaEdit className="mr-2" /> Edit User
        </button>

        


          {/* Seller Rank */}
          {/* <div className="flex items-center">
            <FaTrophy className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Seller Rank:</span> {user.sellerRank}
            </p>
          </div> */}

          {/* Seller Award */}
          {/* <div className="flex items-center">
            <FaAward className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Seller Award:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.sellerAward === "Gold"
                    ? "bg-yellow-100 text-yellow-700"
                    : user.sellerAward === "Silver"
                    ? "bg-gray-100 text-gray-700"
                    : user.sellerAward === "Bronze"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.sellerAward}
              </span>
            </p>
          </div> */}

          {/* Buyer Rank */}
          {/* <div className="flex items-center">
            <FaTrophy className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Buyer Rank:</span> {user.buyerRank}
            </p>
          </div> */}

          {/* Buyer Award */}
          {/* <div className="flex items-center">
            <FaAward className="mr-2 text-gray-700" />
            <p className="text-gray-700">
              <span className="font-semibold">Buyer Award:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.buyerAward === "Gold"
                    ? "bg-yellow-100 text-yellow-700"
                    : user.buyerAward === "Silver"
                    ? "bg-gray-100 text-gray-700"
                    : user.buyerAward === "Bronze"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.buyerAward}
              </span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;