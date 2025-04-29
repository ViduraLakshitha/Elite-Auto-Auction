import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUserTie, FaDollarSign, FaFlagCheckered, FaChartBar, FaDownload, FaTimes } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Scoreboard = () => {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm"
    });
  
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("🏆 VEHICLE AUCTION SCOREBOARD", 148, 15, { align: 'center' });
    
    // Add subtitle with current date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 148, 22, { align: 'center' });
    
    // Prepare data for the table
    const tableData = scoreboard.map((item, index) => [
      index + 1,
      `${item?.vehicleId?.vehicleName || 'N/A'} (${item?.vehicleId?.model || 'N/A'})`,
      item?.finalWinnerUserId?.name || "Unknown",
      `$${(item?.winningBid || 0).toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      })}`,
      item?.auctionStatus ? 
        item.auctionStatus.charAt(0).toUpperCase() + item.auctionStatus.slice(1).toLowerCase() 
        : 'N/A'
    ]);
    
    // Add table using autoTable
    autoTable(doc, {
      head: [
        [
          { content: 'Rank', styles: { halign: 'center', fillColor: [218, 165, 32] } },
          { content: 'Vehicle', styles: { fillColor: [218, 165, 32] } },
          { content: 'Winner', styles: { fillColor: [218, 165, 32] } },
          { content: 'Winning Bid', styles: { halign: 'center', fillColor: [218, 165, 32] } },
          { content: 'Status', styles: { halign: 'center', fillColor: [218, 165, 32] } }
        ]
      ],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [218, 165, 32], // Gold color for header
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 12
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 30, left: 10, right: 10 },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 30, halign: 'center' }
      }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount} • Only completed auctions are shown`,
        148,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save(`Auction_Scoreboard_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-2xl font-semibold text-gold animate-pulse">
          Loading auction results...
        </div>
      </div>
    );
  }

  if (scoreboard.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-xl text-gray-400">
          No auction results available yet!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
          🏆 Vehicle Auction Scoreboard
        </h1>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full shadow-lg transition duration-300 flex items-center space-x-2"
          >
            <FaDownload />
            <span className="hidden sm:inline">Export to PDF</span>
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full shadow-lg transition duration-300 flex items-center space-x-2"
          >
            <FaTimes />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl mb-8 border border-gray-700">
        <table className="w-full table-auto border-collapse bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <thead>
            <tr className="text-gold border-b border-gray-600 text-lg">
              <th className="p-4">
                <div className="flex items-center justify-center">
                  <FaChartBar className="mr-2" /> Rank
                </div>
              </th>
              <th className="p-4 text-left">
                <div className="flex items-center">
                  <FaCar className="mr-2" /> Vehicle
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center justify-center">
                  <FaUserTie className="mr-2" /> Winner
                </div>
              </th>
              <th className="p-4">
                <div className="flex items-center justify-center">
                  <FaDollarSign className="mr-2" /> Winning Bid
                </div>
              </th>
              <th className="p-4">
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
                className={`transition-all duration-200 ${
                  index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-700/50"
                } hover:bg-gray-600/70`}
              >
                <td className="p-4 text-center font-bold text-yellow-400">
                  {index + 1}
                </td>
                <td className="p-4 font-medium">
                  <div className="font-bold">{item?.vehicleId?.vehicleName || 'N/A'}</div>
                  <div className="text-sm text-gray-300">{item?.vehicleId?.model || ''}</div>
                </td>
                <td className="p-4 text-center">
                  {item?.finalWinnerUserId?.name || "Unknown"}
                </td>
                <td className="p-4 text-center font-mono text-green-400">
                  ${(item?.winningBid || 0).toLocaleString()}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item?.auctionStatus === 'completed' 
                      ? 'bg-green-900/50 text-green-300' 
                      : 'bg-blue-900/50 text-blue-300'
                  }`}>
                    {item?.auctionStatus ? 
                      item.auctionStatus.charAt(0).toUpperCase() + item.auctionStatus.slice(1).toLowerCase() 
                      : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Footer */}
      <div className="text-center text-gray-400 text-sm mt-8">
        Showing {scoreboard.length} completed auctions • Generated on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Scoreboard;