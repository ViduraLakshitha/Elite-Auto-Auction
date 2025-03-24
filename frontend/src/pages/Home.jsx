import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import AuctionCard from "../component/auction/AuctionCard";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [recommendedAuctions, setRecommendedAuctions] = useState([]);
  const navigate = useNavigate();
  const userId = "67d46f4c21cd657bcb7dbb87";
  //const userId = localStorage.getItem("userId"); // Retrieve logged-in user ID
  
//   const handleAuctionCardClick = (auctionId) => {
//         navigate(`/auction-details/${auctionId}`);
//         console.log(auctionId);
//    }

//-----------------------------------------------------------------------------------------------------------------------//

   const handleAuctionCardClick = async (auctionId, vehicleId) => {
    navigate(`/auction-details/${auctionId}`);

    //const userId = localStorage.getItem("userId"); // Retrieve logged-in user ID
    //const userId = "67d46f4c21cd657bcb7dbb87";
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

//----------------------------------------------------------------------------------------------------------------------//

  useEffect(() => {
    const fetchAuctions = async () => {
            try {
                const response = await fetch('http://localhost:5555/auction/details'); 
                //console.log("Response",response);
                
                const data = await response.json();
                //console.log("data",data);
                
                setAuctions(data.auctions);
                
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };

           // Fetch recommended auctions
           const fetchRecommendedAuctions = async () => {
            if (!userId) return; // Ensure user is logged in
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

  console.log("length", auctions.length);

  return (
    <div>
            {/* <Header />
            <h1>Auctions</h1>
            {auctions && auctions.length > 0 ? (
                auctions.map((auction) => (
                    <AuctionCard key={auction._id} auction={auction} onClick={()=> handleAuctionCardClick(auction._id)} />  //added onclick attribute
                ))
            ) : (
                <p>No active auctions found.</p>
            )}
            <Footer /> */}

            <Header />
            <div className="m-40">
            <div className="m-30 flex flex-row flex-wrap gap-4 ">
            {/* <h1 className="font-bold text-xl">Active Auctions</h1> */}
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
                <div className=" m-30">
                    <h2 className="font-bold text-xl">Recommended for You</h2>
                    <div className="m-30 flex flex-row flex-wrap gap-4 ">
                    
                    {recommendedAuctions.map((auction) => 
                    auction.vehicleId ? (
                        <AuctionCard 
                            key={auction._id} 
                            auction={auction} 
                            onClick={() => handleAuctionCardClick(auction._id, auction.vehicleId)} 
                        />
                    ): null)}
                    </div>
                </div>
            )}

            <Footer />

        </div>
    
  );
};

export default Home;
