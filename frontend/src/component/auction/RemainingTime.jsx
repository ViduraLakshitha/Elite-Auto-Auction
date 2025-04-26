import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CountdownTimer from './CountdownTimer';

const socket = io("http://localhost:5555");

export default function RemainingTime ({auction, className}) {
    const [endTime, setEndTime] = useState(new Date(auction.endDateTime).getTime());

    useEffect(()=>{
        socket.on("auctionEndTimeUpdated", ({ auctionId, endDateTime }) => {
            if (auctionId === auction._id) {
                console.log("Auction end time updated!", endDateTime);
                setEndTime(new Date(endDateTime).getTime());
            }
        });

        return () => {
            socket.off("auctionEndTimeUpdated");
        };
    }, [auction._id]);

    const handleFinish = () => {
        console.log(`Auction ${auction.title} has finished.`);
    };

  return (
    <div>
        {auction.auctionStatus === "active" && (
                <CountdownTimer className={className} endTime={endTime} onFinish={handleFinish} />
            )}
    </div>
  )
}

