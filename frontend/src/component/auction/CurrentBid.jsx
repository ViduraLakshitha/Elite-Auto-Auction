import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

//const socket = io("http://localhost:5555");

// export default function currentBid( {auction, className} ) {
//     const [currentBid, setCurrentBid] = useState(auction.currentBid);

//     useEffect(()=>{
//         socket.on("bidUpdated", (data) => {
//             if (data.auctionId === auction._id) {
//                 setCurrentBid(data.currentBid);
//             }
//         });

//         return () => {
//             socket.off("bidUpdated");
//         };
//     }, [auction._id]);

//     return (
//         <div>
//             <p className={`${className}`}><span className='font-bold'>Current Bid:</span> ${currentBid}</p>
//         </div>
//     )
// }

const CurrentBid = ({ auction, className }) => {
    return (
      <p className={`font-semibold ${className}`}>
        ${auction?.currentBid?.toLocaleString() || "0"}
      </p>
    );
  };
  
  export default CurrentBid;
  