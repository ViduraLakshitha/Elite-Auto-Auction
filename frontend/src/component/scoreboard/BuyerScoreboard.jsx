import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For PDF table generation
import {
  FaUser,
  FaShoppingCart,
  FaTrophy,
  FaAward,
  FaDownload,
} from "react-icons/fa"; // Import icons

const BuyerScoreboard = () => {
  const [buyers, setBuyers] = useState([]);

  // Fetch buyers data
  useEffect(() => {
    axios
      .get("http://localhost:5555/buyers/")
      .then((response) => {
        setBuyers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching buyers:", error);
      });
  }, []);

  // Generate PDF for the top buyer (winner)
  const generatePDF = () => {
    const topBuyer = buyers[0]; // Get the top buyer (winner)
    if (!topBuyer) {
      alert("No buyers found to generate a report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Top Buyer Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Buyer Name: ${topBuyer.fname} ${topBuyer.lname}`, 10, 20);
    doc.text(`Winning Bids: ${topBuyer.winningBids}`, 10, 30);
    doc.text(`Rank: ${topBuyer.buyerRank}`, 10, 40);
    doc.text(`Awards: ${topBuyer.buyerAward}`, 10, 50);

    doc.save("top_buyer_report.pdf");
  };

  return (
    <div className="container mx-auto p-6  bg-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Top Buyers</h2>

      {/* Buyer Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                <div className="flex items-center">
                  <FaUser className="mr-2" /> Buyer Name
                </div>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700 uppercase">
                <div className="flex items-center justify-center">
                  <FaShoppingCart className="mr-2" /> Winning Bids
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
            {Array.isArray(buyers) && buyers.length > 0 ? (
              buyers.map((buyer, index) => (
                <tr
                  key={buyer._id || index}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index === 0 ? "bg-green-50" : "even:bg-gray-100"
                  }`}
                >
                  <td className="p-4 text-sm text-gray-700 font-medium">
                    {buyer.fname} {buyer.lname}
                  </td>
                  <td className="p-4 text-sm text-gray-700 text-center">
                    {buyer.winningBids}
                  </td>
                  <td className="p-4 text-sm text-gray-700 text-center">{buyer.buyerRank}</td>
                  <td className="p-4 text-sm text-gray-700 text-center">{buyer.buyerAward}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-8 text-gray-500">
                  No buyers found
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
          <FaDownload className="mr-2" /> Download Top Buyer Report (PDF)
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-gray-600 text-sm text-center mt-4">
        Only the top 10 buyers are displayed.
      </p>
    </div>
  );
};

export default BuyerScoreboard;