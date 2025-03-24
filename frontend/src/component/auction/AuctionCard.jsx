// components/VehicleAuctionCard.js
import React from 'react';
import io from 'socket.io-client';
import RemainingTime from './RemainingTime';
import CurrentBid from './CurrentBid';

const socket = io("http://localhost:5555");

export default function  AuctionCard ({ auction, onClick }) {

    return (
        <div className="border p-4 my-2 rounded-md shadow-md" onClick={onClick}>
            <h2 className='font-extrabold'>{auction.auctionTitle}</h2>
            <p>Initial price: ${auction.initialVehiclePrice}</p>
            <p>start date time: {auction.startDateTime}</p>
            <p>end date time: {auction.endDateTime}</p>
            {auction.auctionStatus === "active" && (
                <React.Fragment key={auction._id}>
                    <CurrentBid auction={auction} />
                    <RemainingTime auction={auction} />
                </React.Fragment>
            )}
         </div>
        
  );
};

