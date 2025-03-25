// import React from "react";
import Header from "../component/common/Header";
import Footer from "../component/common/Footer";
import React, { useEffect, useState } from 'react';
import AuctionCard from '../component/auction/AuctionCard';
import AuctionSlider from "../component/common/AuctionSlider";

const Home = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('http://localhost:5555/auction/details'); 
                //console.log("Response",response);
                
                const data = await response.json();
                //console.log("data",data);
                
                setAuctions(data.auctions);
                //console.log("Fetched data from backend:", data);
                //console.log("auctions",auctions.length);
                
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };

        fetchAuctions();
    }, []);

    console.log("length", auctions.length);

    return (
        <div>
            <Header />

            <div className="mt-10 mb-10">
                <AuctionSlider />
            </div>

            <h1>Auctions</h1>
            {auctions && auctions.length > 0 ? (
                auctions.map((auction) => (
                    <AuctionCard key={auction._id} auction={auction} />
                ))
            ) : (
                <p>No active auctions found.</p>
            )}
            <Footer />
        </div>
    );
};

export default Home;
