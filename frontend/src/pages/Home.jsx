import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import { useEffect, useState } from 'react';
import AuctionCard from '../component/auction/AuctionCard';
import { useNavigate } from "react-router";
import io from 'socket.io-client';

const socket = io("http://localhost:5555");

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

        socket.on("newAuctionCreated", (newAuction) => {
            console.log("New auction received from server:", newAuction);
            if (newAuction.auctionStatus === "pending") {
                setAuctions((prevAuctions) => [...prevAuctions,newAuction]);
                console.log("Auction list updated with new auction.");
            }
        });

        return () => {
            socket.off("newAuctionCreated");
        }

    }, []);

    console.log("length", auctions.length);

    return (
        <div>
            <Header />
            <h1>Auctions</h1>
            {auctions && auctions.length > 0 ? (
                auctions.map((auction) => (
                    <AuctionCard key={auction._id} auction={auction} onClick={()=> handleAuctionCardClick(auction._id)} />  //added onclick attribute
                ))
            ) : (
                <p>No active auctions found.</p>
            )}
            <Footer />
        </div>
    );
};

export default Home;
