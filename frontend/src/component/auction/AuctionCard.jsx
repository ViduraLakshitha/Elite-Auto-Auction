// components/VehicleAuctionCard.js
import React from 'react';
// import io from 'socket.io-client';
import RemainingTime from './RemainingTime';
import CurrentBid from './CurrentBid';
import EndDate from './EndDate';
// import imageUrl from "../../../../backend/uploads/porsche_356_speedster.jpg"

// const socket = io("http://localhost:5555");

export default function AuctionCard({ auction, onClick }) {
    // Construct full image URL from backend

    // const imageUrl = auction.images ? `http://localhost:5555${auction.images}` : '/default-car.jpg';

    //console.log("Auction Data:", auction);
    // const imageUrl = auction.images && auction.images.length > 0
    //     ? `http://localhost:5555/${auction.images[0]}`  // Construct full URL
    //     : '/default-car.jpg'; 

    const test = auction.vehicleId?.images || "Unknown"
    const imageUrl = test && test.length > 0 ?
        `http://localhost:5555/${test[0]}`
        : '/default-car.jpg';

    return (
        <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white w-105 mt-7 mb-7" onClick={onClick}>
            <img src={imageUrl} alt="Car" className='w-full h-48 object-cover' onError={(e) => e.target.src = '/default-car.jpg'} />
            <div className='p-4'>
                <h2 className='font-bold text-lg'>{auction.auctionTitle}</h2>
                <p className="text-gray-500">
                Location: {auction.vehicleId?.currentLocation || "Unknown"}
                </p>
                {/* <p className='text-gray-600 text-sm'>Initial price: <span className='font-semibold'> ${auction.initialVehiclePrice}</span></p> */}
                {/* <p className='text-gray-500 text-xs'>Start date time: {auction.startDateTime}</p> */}
                <EndDate auction={auction}/>
                {auction.auctionStatus === "active" && (
                    <React.Fragment key={auction._id}>
                        <span className='flex text-gray-500'>Current Bid <CurrentBid auction={auction} className={'ml-2 text-black mb-2'}/></span>
                        <RemainingTime auction={auction}/>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};