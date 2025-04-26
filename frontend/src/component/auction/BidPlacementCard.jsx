import React, { useEffect, useState } from "react";
import RemainingTime from "./RemainingTime";
import { useParams } from 'react-router-dom';
import CurrentBid from './CurrentBid'
import EndDate from "./EndDate";
import axios from "axios"

export default function BidPlacementCard({auction, userId}){
    const{id} = useParams()
    const [bidAmount, setBidAmount] = useState("")
    const [bid, setBid] = useState([])
    const [bidCount, setBidCount] = useState(0)
    // const [minBid, setMinBid] = useState();

    // console.log(`ddvsvs${auction.initialVehiclePrice}`);
    // console.log(id);
    
    

        // if (auction.currentBid === 0) {
        //     setMinBid(auction.initialVehiclePrice + 250);
        // } else {
        //     setMinBid(auction.currentBid + 250);
        // }
    

    // useEffect(()=>{
    //     const fetchBids=async()=>{
    //         try{
    //             const response = await fetch(`http://localhost:5555/bid/bid-records/${id}`)
    //             console.log(response);
                
    //             const data = await response.json()
    //             setBid(data)
    //             setBidCount(bid.length)
    //         }catch(error){
    //             console.error('Error fetching bids:', error);
                
    //         }
    //     }
    //     fetchBids();
    // },[id])

    // console.log("Bid",bid.length);
    

    const handleBidChange=(e) =>{
        setBidAmount(e.target.value);
    }

    const handlePlaceBid = async() => {

        console.log(`ffffffffffffffffffffffff${id}`);
        console.log(`ffffffffffffffffffffffff${bidAmount}`);
        console.log(`ffffffffffffffffffffffff${userId}`);
        
        if(!userId){
            alert("You must have login first!");
            return
        }
        console.log(`currentbid ${auction.currentBid}`);
        console.log(`bidamount ${bidAmount}`);
        
        
        if(auction.currentBid === 0 && bidAmount <= auction.initialVehiclePrice){
            alert(`starting bid price is ${auction.initialVehiclePrice + 250}`)
        }
        console.log(`initialprice ${auction.initialVehiclePrice}`);
        
        if(auction.currentBid != 0 && bidAmount <= auction.currentBid + 250){
                alert(`placea bid of ${auction.currentBid + 250} or more`)
        }

        try {
            if (!id || !userId || !bidAmount) {
                alert("All fields are required!");
                return;
            }

            //++++++++++++++++++++++++++++++++++++++++++++++
            const res = await axios.post("http://localhost:5555/bid/bid-place", FormData,{
                headers: {
                    "Content-Type": "application/json",
                },
            });
            //++++++++++++++++++++++++++++++++++++++++++++++
        
            // const response = await fetch("http://localhost:5555/bid/bid-place", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ id, userId, bidAmount })
            // });
            // console.log(`hhhhhhhhhhhhhhhhhhhhhhh ${response}`);
            
        
            let data;
            try {
                data = await response.json();
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
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-4/10 mx-auto my-11">
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











