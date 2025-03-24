import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For PDF table generation
import {
  FaUser,
  FaTrophy,
  FaAward,
  FaDownload,
  FaChartLine,
} from "react-icons/fa"; // Import icons

const SellerScoreboard = () => {
  const [sellers, setSellers] = useState([]);

  // Fetch sellers data
  useEffect(() => {
    axios
      .get("http://localhost:5555/sellers/")
      .then((response) => {
        setSellers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sellers:", error);
      });
  }, []);

  // Generate PDF for the top seller
  const generatePDF = () => {
    const topSeller = sellers[0]; // Get the top seller (winner)
    if (!topSeller) {
      alert("No sellers found to generate a report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Top Seller Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Seller Name: ${topSeller.fname} ${topSeller.lname}`, 10, 20);
    doc.text(`Successful Auctions: ${topSeller.successfulCompletedAuctions}`, 10, 30);
    doc.text(`Rank: ${topSeller.sellerRank}`, 10, 40);
    doc.text(`Awards: ${topSeller.sellerAward}`, 10, 50);

    doc.save("top_seller_report.pdf");
  };

  return (
    <div className="container mx-auto p-6  bg-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Top Sellers</h2>

      {/* Seller Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                <div className="flex items-center">
                  <FaUser className="mr-2" /> Seller Name
                </div>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase">
                <div className="flex items-center justify-center">
                  <FaChartLine className="mr-2" /> Successful Auctions
                </div>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase">
                <div className="flex items-center justify-center">
                  <FaTrophy className="mr-2" /> Rank
                </div>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase">
                <div className="flex items-center justify-center">
                  <FaAward className="mr-2" /> Awards
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(sellers) && sellers.length > 0 ? (
              sellers.map((seller, index) => (
                <tr
                  key={seller._id || index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index === 0 ? "bg-green-50" : "even:bg-gray-100"
                  }`}
                >
                  <td className="p-4 text-sm text-gray-700 font-medium">
                    {seller.fname} {seller.lname}
                  </td>
                  <td className="p-4 text-sm text-gray-700 text-center">
                    {seller.successfulCompletedAuctions}
                  </td>
                  <td className="p-4 text-sm text-gray-700 text-center">{seller.sellerRank}</td>
                  <td className="p-4 text-sm text-gray-700 text-center">{seller.sellerAward}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-8 text-gray-500">
                  No sellers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Download PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={generatePDF}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FaDownload className="mr-2" /> Download Top Seller Report (PDF)
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-gray-600 text-sm text-center mt-4">
        Only the top 10 sellers are displayed.
      </p>
    </div>
  );
};

export default SellerScoreboard;