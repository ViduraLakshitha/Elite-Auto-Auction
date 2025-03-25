// components/VehicleAuctionCard.js
import React from 'react';
import io from 'socket.io-client';
import RemainingTime from './RemainingTime';
import CurrentBid from './CurrentBid';

const socket = io("http://localhost:5555");

export default function  AuctionCard ({ auction, onClick }) {

    return (
        <div className="border p-4 my-2 rounded-md shadow-md h-100 w-80 " onClick={onClick}>
            <h2 className='font-extrabold text-xl'>{auction.auctionTitle}</h2>
            <p className='text-gray-600'>auction id: {auction._id}</p>
            <p className='text-gray-500'>Initial price: ${auction.initialVehiclePrice}</p>
            <p className='text-gray-500 text-sm'>start date time: {auction.startDateTime}</p>
            <p className='text-gray-500 text-sm'>end date time: {auction.endDateTime}</p>
            {auction.auctionStatus === "active" && (
                <React.Fragment key={auction._id}>
                    <CurrentBid auction={auction} />
                    <RemainingTime auction={auction} />
                </React.Fragment>
            )}
         </div>
        
  );
};

