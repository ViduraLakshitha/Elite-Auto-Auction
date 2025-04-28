// import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import AuctionCard from "../component/auction/AuctionCard";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import AuctionSlider from "../component/common/AuctionSlider"; // ✅ Only once

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [recommendedAuctions, setRecommendedAuctions] = useState([]);
  const navigate = useNavigate();
  const userId = "67d46f4c21cd657bcb7dbb87"; 
  // const userId = localStorage.getItem("userId"); // (for dynamic login later)

  const handleAuctionCardClick = async (auctionId, vehicleId) => {
    navigate(`/auction-details/${auctionId}`);

    if (!userId) return;

    try {
      await fetch('http://localhost:5555/auction/track-click', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vehicleId })
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('http://localhost:5555/auction/details');
        const data = await response.json();
        setAuctions(data.auctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    const fetchRecommendedAuctions = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5555/auction/recommended/${userId}`);
        const data = await response.json();
        setRecommendedAuctions(data.recommendedAuctions || []);
      } catch (error) {
        console.error("Error fetching recommended auctions:", error);
      }
    };

    fetchAuctions();
    fetchRecommendedAuctions();
  }, [userId]);

  return (
    <div>
      <Header />

      <div className="mt-10 mb-10">
        <AuctionSlider />
      </div>

      <div className="m-4">
        <h1 className="font-bold text-xl ml-70">Active Auctions</h1>
        <div className="ml-65 mr-50 mb-10 flex flex-row flex-wrap gap-8">
          {auctions.length > 0 ? (
            auctions.map((auction) => (
              <AuctionCard
                key={auction._id}
                auction={auction}
                onClick={() => handleAuctionCardClick(auction._id, auction.vehicleId)}
              />
            ))
          ) : (
            <p>No active auctions found.</p>
          )}
        </div>
      </div>

      {userId && recommendedAuctions.length > 0 && (
        <div className="ml-4 mt-5">
          <h2 className="font-bold text-xl ml-70">Recommended for You</h2>
          <div className="ml-65 mr-50 mb-10 flex flex-row flex-wrap gap-8">
            {recommendedAuctions.map((auction) =>
              auction.vehicleId ? (
                <AuctionCard
                  key={auction._id}
                  auction={auction}
                  onClick={() => handleAuctionCardClick(auction._id, auction.vehicleId)}
                />
              ) : null
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
