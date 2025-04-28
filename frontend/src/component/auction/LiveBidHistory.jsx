// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const LiveBidHistory = ({ auctionId }) => {
//   const [bids, setBids] = useState([]);

//   useEffect(() => {
//     const socket = io("http://localhost:5555");

//     socket.on("bidPlaced", (data) => {
//       if (data.auctionId === auctionId) {
//         setBids((prevBids) => [...prevBids, data]);
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [auctionId]);

//   const formatDateTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
//   };

//   return (
//     <>
//         <p className="font-bold text-xl ml-80 mb-5">Bid History</p>
//     <div className="max-h-60 overflow-y-scroll p-2 border rounded 0 bg-green-400  w-xl ml-80 border-0">
//       {bids.map((bid, index) => (
//         <div key={index} className="mb-2 bg-yellow-100 p-2 rounded">
//           <span className="text-sm text-gray-600">{formatDateTime(bid.placedAt)}</span>
//           <div className="font-semibold text-black">
//             USD ${bid.amount.toLocaleString()} bid placed by <span className="underline">{bid.placedBy}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//     </>
//   );
// };

// export default LiveBidHistory;






import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const LiveBidHistory = ({ auctionId }) => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5555");

    // Fetch existing bids when component mounts
    const fetchBids = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/bid/bid-records/${auctionId}`);
        const sortedBids = response.data.sort((a, b) => new Date(a.time) - new Date(b.time)); // sort oldest to newest
        setBids(sortedBids);
      } catch (error) {
        if(error.response && error.response.status === 404){
            console.log("No bids found for this auction!");
            setBids([]);
        }else{
            console.error("Error fetching bids:", error);
        }
        
      }
    };

    fetchBids();

    socket.on("bidPlaced", (data) => {
      if (data.auctionId === auctionId) {
        setBids((prevBids) => [...prevBids, data]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [auctionId]);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="ml-10">
      <p className="font-bold ml-4 mt-17">Bid History</p>
      <div className="max-h-60 overflow-y-scroll p-2 border rounded w-fit  border-0 ">
        {bids.length === 0 ? (
            <p className="text-gray-500 ml-2">No bids placed yet!</p>
        ) : (
            bids.map((bid, index) => (
                <div key={index} className="mb-2  p-2 rounded">
                  <span className="text-sm text-gray-600">{formatDateTime(bid.time || bid.placedAt)}</span>
                  <div className="font-semibold text-black">
                    USD ${bid.bidAmount?.toLocaleString() || bid.amount?.toLocaleString()} bid placed by <span className="underline">{bid.placedBy || bid.userId?.fName}</span>
                  </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default LiveBidHistory;
