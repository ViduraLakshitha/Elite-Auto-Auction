import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUserTie, FaDollarSign, FaFlagCheckered, FaChartBar, FaDownload, FaTimes } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../component/common/Navbar";

const Scoreboard = () => {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const response = await axios.get("http://localhost:5555/auction/scoreboard");
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
  
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("VEHICLE AUCTION SCOREBOARD", 148, 15, { align: 'center' });
    
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
    
    const tableData = scoreboard.map((item, index) => [
      index + 1,
      `${item?.vehicleId?.vehicleName || item?.vehicleId?.brand || 'Unknown'} ${item?.vehicleId?.model ? `(${item.vehicleId.model})` : ''}`,
      (item?.finalWinnerUserId?.name) ? `${item.finalWinnerUserId.name}` : "Unknown Bidder",
      `$${(item?.winningBid || 0).toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      })}`,
      item?.auctionStatus ? 
        item.auctionStatus.charAt(0).toUpperCase() + item.auctionStatus.slice(1).toLowerCase() 
        : 'Unknown'
    ]);
    
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
        fillColor: [218, 165, 32],
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
    
    doc.save(`Auction_Scoreboard_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-2xl font-serif font-semibold text-amber-100 animate-pulse">
          Loading auction results...
        </div>
      </div>
    );
  }

  if (scoreboard.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-xl font-serif text-amber-100">
          No auction results available yet!
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col bg-gradient-to-b bg-gray-50">
      <div className="container mx-auto px-6 py-16 flex-grow">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-amber-100 mb-6 font-serif tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
              🏆 Auction Scoreboard
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl to-gray-800 leading-relaxed max-w-3xl mx-auto">
            Explore the results of our premium vehicle auctions. Below you'll find all completed auctions with their winning bids.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <FaDownload />
            <span>Export to PDF</span>
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 text-amber-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow hover:shadow-md"
          >
            <FaTimes />
            <span>Close</span>
          </button>
        </div>

        {/* Table */}
        <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
              <tr className="border-b border-gray-700">
                <th className="py-5 px-6 text-left font-serif font-semibold text-amber-200">
                  <div className="flex items-center">
                    <FaChartBar className="mr-3 text-amber-400" /> Rank
                  </div>
                </th>
                <th className="py-5 px-6 text-left font-serif font-semibold text-amber-200">
                  <div className="flex items-center">
                    <FaCar className="mr-3 text-amber-400" /> Vehicle
                  </div>
                </th>
                <th className="py-5 px-6 text-left font-serif font-semibold text-amber-200">
                  <div className="flex items-center">
                    <FaUserTie className="mr-3 text-amber-400" /> Winner
                  </div>
                </th>
                <th className="py-5 px-6 text-left font-serif font-semibold text-amber-200">
                  <div className="flex items-center">
                    <FaDollarSign className="mr-3 text-amber-400" /> Winning Bid
                  </div>
                </th>
                <th className="py-5 px-6 text-left font-serif font-semibold text-amber-200">
                  <div className="flex items-center">
                    <FaFlagCheckered className="mr-3 text-amber-400" /> Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="border-b border-gray-700 hover:bg-gray-750 transition duration-150"
                >
                  <td className="py-5 px-6 font-serif font-bold text-amber-400">
                    {index + 1}
                  </td>
                  <td className="py-5 px-6">
                    <div className="font-medium text-gray-100">
                      {item?.vehicleId?.vehicleName || item?.vehicleId?.brand || 'Unknown Vehicle'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {item?.vehicleId?.model ? `${item.vehicleId.model}${item?.vehicleId?.year ? ` (${item.vehicleId.year})` : ''}` : 'No model info'}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-gray-200">
                    {(item?.finalWinnerUserId?.name) ? `${item.finalWinnerUserId.name}` : "Unknown Bidder"}
                  </td>
                  <td className="py-5 px-6 font-mono text-amber-300">
                    ${(item?.winningBid || 0).toLocaleString()}
                  </td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      item?.auctionStatus === 'completed' || item?.auctionStatus === 'ended'
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {item?.auctionStatus 
                        ? item.auctionStatus.charAt(0).toUpperCase() + item.auctionStatus.slice(1).toLowerCase() 
                        : 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm mt-8">
          Showing {scoreboard.length} completed auctions • Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
    </>
  );
};

export default Scoreboard;