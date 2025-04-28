import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUserTie, FaDollarSign, FaFlagCheckered, FaChartBar, FaDownload, FaTimes } from "react-icons/fa";

const Scoreboard = () => {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- Create navigate instance

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const response = await axios.get("http://localhost:5555/api/scoreboard");
        if (Array.isArray(response.data)) {
          setScoreboard(response.data);
        } else {
          setScoreboard([]);
        }
      } catch (error) {
        console.error("Error fetching scoreboard", error);
        setScoreboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreboard();
  }, []);

  const downloadCSV = () => {
    const headers = ["Rank", "Vehicle", "Winner", "Winning Bid", "Auction Status"];
    const rows = scoreboard.map((item, index) => [
      index + 1,
      `${item?.vehicleId?.vehicleName} (${item?.vehicleId?.model})`,
      item?.finalWinnerUserId?.name || "Unknown",
      `$${item?.winningBid?.toLocaleString() || 0}`,
      item?.auctionStatus
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "auction_scoreboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    navigate("/"); // Go to Home page
  };

  if (loading) {
    return <div className="text-center mt-10 text-2xl font-semibold text-gold">Loading luxurious data...</div>;
  }

  if (scoreboard.length === 0) {
    return <div className="text-center mt-10 text-xl text-gray-400">No auction results yet!</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <h1 className="text-4xl font-extrabold text-center w-full text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
          Vehicle Auction Scoreboard
        </h1>

        {/* Download Button */}
        <button
          onClick={downloadCSV}
          className="absolute right-16 top-0 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center space-x-2"
        >
          <FaDownload />
          <span>Download Winners List</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl shadow-2xl mb-8">
        <table className="w-full table-auto border-collapse bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <thead>
            <tr className="text-gold border-b border-gray-600 text-lg">
              <th className="p-5">
                <div className="flex items-center justify-center">
                  <FaChartBar className="mr-2" /> Rank
                </div>
              </th>
              <th className="p-5 text-left">
                <div className="flex items-center">
                  <FaCar className="mr-2" /> Vehicle
                </div>
              </th>
              <th className="p-5">
                <div className="flex items-center justify-center">
                  <FaUserTie className="mr-2" /> Winner
                </div>
              </th>
              <th className="p-5">
                <div className="flex items-center justify-center">
                  <FaDollarSign className="mr-2" /> Winning Bid
                </div>
              </th>
              <th className="p-5">
                <div className="flex items-center justify-center">
                  <FaFlagCheckered className="mr-2" /> Status
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((item, index) => (
              <tr
                key={item._id || index}
                className={`transition-all duration-300 ${
                  index === 0 ? "bg-yellow-900/20" : "hover:bg-gray-700/30"
                }`}
              >
                <td className="p-5 text-center font-bold">{index + 1}</td>
                <td className="p-5 font-medium">
                  {item?.vehicleId?.vehicleName} ({item?.vehicleId?.model})
                </td>
                <td className="p-5 text-center">{item?.finalWinnerUserId?.name || "Unknown"}</td>
                <td className="p-5 text-center">
                  ${item?.winningBid?.toLocaleString() || 0}
                </td>
                <td className="p-5 text-center capitalize">
                  {item?.auctionStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Close Button */}
      <div className="text-center">
        <button
          onClick={handleClose}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center space-x-2"
        >
          <FaTimes />
          <span>Close</span>
        </button>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-gray-400 text-sm">
        Only completed Vehicle auctions are shown here.
      </p>
    </div>
  );
};

export default Scoreboard;
