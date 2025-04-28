import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import AuctionCard from "../component/auction/AuctionCard";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import AuctionSlider from "../component/common/AuctionSlider";
import io from 'socket.io-client';

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();
  
  const handleAuctionCardClick = (auctionId) => {
        navigate(`/auction-details/${auctionId}`);
        console.log(auctionId);
   }

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

        fetchAuctions();

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

  }, []);

  //console.log("length", auctions.length);

  return (
    <div>
            <Header />
            <div className="mt-10 mb-10">
                <AuctionSlider />
            </div>
            <hr className="w-5/6 mx-auto mt-20 mb-15 text-gray-400"/>
            <h1 className="font-bold text-2xl ml-48">Active Auctions</h1>
            <div className="flex flex-row flex-wrap pl-44 space-x-16 pb-16">
                {auctions && auctions.length > 0 ? (
                        auctions.map((auction) => (
                            <AuctionCard key={auction._id} auction={auction} onClick={()=> handleAuctionCardClick(auction._id)} />  //added onclick attribute
                        ))
                    ) : (
                        <p className="bg-green-300 p-3 rounded-md mt-20 mx-auto">No active auctions found!</p>
                    )}
            </div>

            <Footer />
        </div>
  );
};

export default Home;
