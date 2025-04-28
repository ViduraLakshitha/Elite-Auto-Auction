import React, { useEffect, useState } from "react";
import RemainingTime from "./RemainingTime";
import { useParams } from 'react-router-dom';
import CurrentBid from './CurrentBid'
import EndDate from "./EndDate";
import io from 'socket.io-client';

export default function BidPlacementCard({auction, userId}){
    const{id} = useParams()
    const [bidAmount, setBidAmount] = useState("")
    const [bidCount, setBidCount] = useState(auction.bidCount)
    
    useEffect(() => {
        const socket = io("http://localhost:5555");
    
        socket.on("newBidPlaced", (data) => {
            if (data.auctionId === id) { // id of this auction card
                setBidCount(data.bidCount); // update the local state
            }
        });
    
        return () => {
            socket.disconnect();
        };
    }, []);
    
    const handleBidChange=(e) =>{
        setBidAmount(e.target.value);
    }

    const handlePlaceBid = async() => {
        
        if(!userId){
            alert("You must have login first!");
            return
        }
        console.log(`currentbid ${auction.currentBid}`);
        console.log(`bidamount ${bidAmount}`);
        
        
        if(auction.currentBid === 0 && bidAmount <= auction.initialVehiclePrice){
            alert(`starting bid price is ${auction.initialVehiclePrice + 250}`)
            return
        }
        console.log(`initialprice ${auction.initialVehiclePrice}`);
        
        if(auction.currentBid != 0 && bidAmount <= auction.currentBid + 249){
                //alert(`place a bid of ${auction.currentBid + 250} or more`)
                alert(`minimum bid increment is 250$`)
                return
        }

        try {
            console.log(`userIf ${userId}`);
            console.log(`aucId ${id}`);
            console.log(`bidAAA ${bidAmount}`);


            if (!id || !userId || !bidAmount) {
                alert("All fields are required!");
                return;
            }
        
            const response = await fetch("http://localhost:5555/bid/bid-place", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auctionId:id, userId, bidAmount })
            });
            console.log(`${response}`);
        
            let data;
            try {
                data = await response.json();
                console.log(data);
                
            } catch (error) {
                console.error("Invalid JSON response", error);
                alert("Unexpected server response");
                return;
            }
            
        
            if (response.ok) {
                setBidAmount("");
                alert(data.message);
            } else {
                console.error("Error Response:", response.status, data);
                alert(data.message || "Failed to place bid");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Failed to place bid. Please try again.");
        }
    }

    return(
        <div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md my-11">
            <h2 className="font-bold text-lg mb-4">Bid on This Listing</h2>
            <div className="space-y-2">
                <div className="flex gap-32">
                    <span className="text-gray-600">Current Bid</span>
                    <CurrentBid auction={auction}/>
                </div>
                <div className="flex gap-36">
                    <span className="text-gray-600">Time Left</span>
                    <RemainingTime auction={auction}/>
                </div>
                <div className="flex gap-39.5">
                    <span className="text-gray-600">Closing</span>
                    <EndDate auction={auction}/>
                </div>
                <div className="flex gap-45">
                    <span className="text-gray-600">Bids</span>
                    <span className="font-semibold">{bidCount}</span>
                </div>
            </div>
            
            <div className="mt-4 flex">
                <label className="font-semibold block mb-2 mr-7 pt-2">Place Bid</label>
                <div className="flex items-center gap-3">
                    <span className="font-semibold">USD $</span>
                    <input
                        type="number"
                        className="border p-2 rounded w-2/4"
                        placeholder={`Enter USD $...`}
                        value={bidAmount}
                        onChange={handleBidChange}
                    />
                    <button 
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        onClick={handlePlaceBid}
                    >
                        Place Bid
                    </button>
                </div>
            </div>
        </div>
        </div>
    )
}











