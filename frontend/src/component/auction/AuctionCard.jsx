// components/VehicleAuctionCard.js

import React from 'react';
import CountdownTimer from './CountdownTimer';

export default function  AuctionCard ({ auction, onClick }) {
    const handleFinish = () => {
        console.log(`Auction ${auction.title} has finished.`);
    };

    return (
        <div className="border p-4 my-2 rounded-md shadow-md" onClick={onClick}>
            <h2>{auction.title}</h2>
            <p>Initial price: ${auction.initialVehiclePrice}</p>
            <p>start date time: {auction.startDateTime}</p>
            <p>end date time: {auction.endDateTime}</p>
            {/* <p>Auction Id: ${auction._id}</p> */}
            <p>current bid: ${auction.currentBid}</p>
            <p>Status: {auction.auctionStatus}</p>
            {auction.auctionStatus === "active" && (
                <CountdownTimer endTime={new Date(auction.endDateTime).getTime()} onFinish={handleFinish} />
            )}
        </div>
    );
};

