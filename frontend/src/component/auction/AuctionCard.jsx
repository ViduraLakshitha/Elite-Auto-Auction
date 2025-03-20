// components/VehicleAuctionCard.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CountdownTimer from './CountdownTimer';

const socket = io("http://localhost:5555");

export default function  AuctionCard ({ auction, onClick }) {
    const [currentBid, setCurrentBid] = useState(auction.currentBid);
    const [endTime, setEndTime] = useState(new Date(auction.endDateTime).getTime());

    useEffect(() => {
        socket.on("bidUpdated", (data) => {
            if (data.auctionId === auction._id) {
                setCurrentBid(data.currentBid);
            }
        });

        // Listen for real-time end time updates
        socket.on("auctionEndTimeUpdated", ({ auctionId, endDateTime }) => {
            if (auctionId === auction._id) {
                console.log("Auction end time updated!", endDateTime);
                setEndTime(new Date(endDateTime).getTime());
            }
        });

        return () => {
            socket.off("bidUpdated");
            socket.off("auctionEndTimeUpdated");
        };
    }, [auction._id]);

    const handleFinish = () => {
        console.log(`Auction ${auction.title} has finished.`);
    };

    return (
        <div className="border p-4 my-2 rounded-md shadow-md" onClick={onClick}>
            <h2>{auction.title}</h2>
            <p>Initial price: ${auction.initialVehiclePrice}</p>
            <p>start date time: {auction.startDateTime}</p>
            <p>end date time: {auction.endDateTime}</p>
            <p>current bid: ${currentBid}</p>
            {auction.auctionStatus === "active" && (
                <CountdownTimer endTime={endTime} onFinish={handleFinish} />
            )}
        </div>
    );
};

