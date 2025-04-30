import React from 'react'
import Header from '../component/common/Header'
import Footer from '../component/common/Footer'
import { useState, useEffect } from 'react'
import AuctionCard from "../component/auction/AuctionCard";
import { useNavigate } from "react-router";
import io from 'socket.io-client';

const AuctionsAll = () => {
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

  return (
    <>
    <div><Header/></div>
    <div className="container mx-auto px-6 py-10">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Active Auctions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Browse our current live auctions and place your bids before time runs out
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions && auctions.length > 0 ? (
                auctions.map((auction) => (
                    <AuctionCard key={auction._id} auction={auction} onClick={()=> handleAuctionCardClick(auction._id)} />
                ))
            ) : (
                <div className="col-span-3 text-center py-16">
                    <div className="inline-block px-8 py-6 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-lg text-amber-800">No active auctions found at the moment</p>
                        <p className="text-gray-600 mt-2">Please check back soon for new listings</p>
                    </div>
                </div>
            )}
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default AuctionsAll