// components/VehicleAuctionCard.js

import React from 'react';
import CountdownTimer from './CountdownTimer';

const AuctionCard = ({ auction }) => {
    const handleFinish = () => {
        console.log(`Auction ${auction.title} has finished.`);
    };

    return (
        <div className="border p-4 my-2 rounded-md shadow-md">
            <h2>{auction.title}</h2>
            <p>Initial price: ${auction.initialVehiclePrice}</p>
            <p>current bid: ${auction.currentBid}</p>
            <p>Status: {auction.auctionStatus}</p>
            {auction.auctionStatus === "active" && (
                <CountdownTimer endTime={new Date(auction.endDateTime).getTime()} onFinish={handleFinish} />
            )}
        </div>
    );
};

export default AuctionCard;
