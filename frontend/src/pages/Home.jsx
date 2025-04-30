import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import AuctionCard from "../component/auction/AuctionCard";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import AuctionSlider from "../component/common/AuctionSlider";
import io from 'socket.io-client';
import { FaCrown, FaChevronRight, FaGavel } from "react-icons/fa";

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [recommendedAuctions, setRecommendedAuctions] = useState([]);
  const navigate = useNavigate();
  const userId = "680fcdd1319cd5cad595cf56"; 

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
        const response = await fetch('http://localhost:5555/auction/home');
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

    const socket = io('http://localhost:5555');
    socket.on('bidUpdated', (data) => {
      setAuctions(prevAuctions => 
        prevAuctions.map(auction => 
          auction._id === data.auctionId
            ? { ...auction, currentBid: data.currentBid }
            : auction
        )
      );
    });
  
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Slider Section */}
        <div className="mt-16 mb-24">
          <AuctionSlider />
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-6 pb-24">
          {/* Active Auctions CTA Button */}
          <div className="flex justify-center mb-16">
            <button 
              onClick={() => navigate('/auctions-all')}
              className="flex items-center bg-amber-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-amber-700 transition-colors"
            >
              <FaGavel className="mr-3 text-lg" />
              <span className="text-lg font-semibold">View Active Auctions</span>
              <FaChevronRight className="ml-3" />
            </button>
          </div>

          {/* Premium Showcase Section */}
          <section className="max-w-7xl mx-auto mb-28">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <FaCrown className="text-amber-500 mr-3 text-2xl" />
                <h1 className="text-5xl font-bold text-gray-900 font-serif tracking-tight">
                  The <span className="text-amber-500">Elite</span> Collection
                </h1>
              </div>
              <div className="h-px w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the world's most coveted classic and luxury automobiles, each meticulously vetted for authenticity and provenance.
              </p>
            </div>

            {/* Current Auctions Section */}
            <div className="mb-24">
              <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-6">
                <div>
                  <h2 className="text-3xl font-serif font-semibold text-gray-900">
                    Timeless Masterpieces
                  </h2>
                  <p className="text-gray-500 mt-2">Active auctions awaiting your bid</p>
                </div>
                <button className="flex items-center text-amber-600 hover:text-amber-700 transition-colors">
                  <span className="font-medium">View All</span>
                  <FaChevronRight className="ml-2 text-sm" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {auctions.length > 0 ? (
                  auctions.map((auction) => (
                    <AuctionCard
                      key={auction._id}
                      auction={auction}
                      onClick={() => handleAuctionCardClick(auction._id, auction.vehicleId)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <div className="inline-block px-8 py-6 bg-gray-100 rounded-lg">
                      <p className="text-lg text-gray-500">Our gallery is currently preparing new acquisitions</p>
                      <p className="text-gray-400 mt-2">Please check back soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Section */}
            {userId && recommendedAuctions.length > 0 && (
              <div className="mt-32">
                <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-6">
                  <div>
                    <h2 className="text-3xl font-serif font-semibold text-gray-900">
                      Selected For Your Taste
                    </h2>
                    <p className="text-gray-500 mt-2">Curated based on your collector profile</p>
                  </div>
                  <button className="flex items-center text-amber-600 hover:text-amber-700 transition-colors">
                    <span className="font-medium">View All</span>
                    <FaChevronRight className="ml-2 text-sm" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
          </section>

          {/* Heritage Section */}
          <section className="max-w-7xl mx-auto bg-gray-900 rounded-lg p-16 mb-24 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1480')] bg-blend-overlay bg-cover bg-center">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif font-bold text-white mb-6">
                A Legacy of Automotive Excellence
              </h2>
              <div className="h-px w-24 bg-amber-500 mb-8"></div>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Elite Auto Auctions has been the trusted curator for discerning collectors worldwide, specializing in rare and investment-grade automobiles.
              </p>
              <button className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-sm uppercase tracking-wider text-sm font-medium transition-colors duration-300">
                Our Heritage
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;