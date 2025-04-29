// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import CountdownTimer from './CountdownTimer';
// import WinPopUp from './WinPopUp';

// const socket = io("http://localhost:5555");

// export default function RemainingTime ({auction, className, userId}) {
//     const [endTime, setEndTime] = useState(new Date(auction.endDateTime).getTime());

//     useEffect(()=>{
//         socket.on("auctionEndTimeUpdated", ({ auctionId, endDateTime }) => {
//             if (auctionId === auction._id) {
//                 console.log("Auction end time updated!", endDateTime);
//                 setEndTime(new Date(endDateTime).getTime());
//             }
//         });

//         return () => {
//             socket.off("auctionEndTimeUpdated");
//         };
//     }, [auction._id]);

//     const handleFinish = () => {
//         if(userId === auction.finalWinnerUserId){
//             alert("Hello")//+++++++++++++++++++++++++++++++++++++++++
//             return <WinPopUp/>
//         }
//         console.log(`Auction ${auction.title} has finished.`);
        
        
//     };

//   return (
//     <div>
//         {auction.auctionStatus === "active" && (
//             <CountdownTimer className={className} endTime={endTime} onFinish={handleFinish} />
//         )}
//     </div>
//   )
// }




import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CountdownTimer from './CountdownTimer';
import WinPopUp from './WinPopUp';

const socket = io("http://localhost:5555");

export default function RemainingTime({ auction, className, userId }) {
    const [endTime, setEndTime] = useState(new Date(auction.endDateTime).getTime());
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [hasCheckedInitialStatus, setHasCheckedInitialStatus] = useState(false);

    // Handle auction end time updates
    useEffect(() => {
        socket.on("auctionEndTimeUpdated", ({ auctionId, endDateTime }) => {
            if (auctionId === auction._id) {
                setEndTime(new Date(endDateTime).getTime());
            }
        });

        return () => {
            socket.off("auctionEndTimeUpdated");
        };
    }, [auction._id]);

    // Check initial win status when component mounts
    useEffect(() => {
        if (!hasCheckedInitialStatus && auction.auctionStatus === "ended" && auction.finalWinnerUserId === userId) {
            setShowWinPopup(true);
            setHasCheckedInitialStatus(true);
        }
    }, [auction, userId, hasCheckedInitialStatus]);

    // Cleanup when auction changes
    useEffect(() => {
        return () => {
            setShowWinPopup(false);
            setHasCheckedInitialStatus(false);
        };
    }, [auction._id]);

    const handleFinish = () => {
        console.log(`Auction ${auction.title} has finished.`);
        if (userId === auction.finalWinnerUserId) {
            setShowWinPopup(true);
        }
    };

    return (
        <div className="remaining-time-container">
            {auction.auctionStatus === "active" ? (
                <CountdownTimer 
                    className={className} 
                    endTime={endTime} 
                    onFinish={handleFinish} 
                />
            ) : (
                <span className="auction-status-badge">
                    {auction.finalWinnerUserId ? <span className='bg-red-700 py-1 px-2 rounded-lg text-white'>SOLD</span> : "ENDED"}
                </span>
            )}

            <WinPopUp 
                open={showWinPopup} 
                onClose={() => setShowWinPopup(false)}
                auctionTitle={auction.auctionTitle}
            />
        </div>
    );
}










// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import CountdownTimer from './CountdownTimer';
// import WinPopUp from './WinPopUp';

// const socket = io("http://localhost:5555");

// export default function RemainingTime({ auction, className, userId }) {
//     const [endTime, setEndTime] = useState(new Date(auction.endDateTime).getTime());
//     const [showWinPopup, setShowWinPopup] = useState(false);

//     useEffect(() => {
//         socket.on("auctionEndTimeUpdated", ({ auctionId, endDateTime }) => {
//             if (auctionId === auction._id) {
//                 setEndTime(new Date(endDateTime).getTime());
//             }
//         });

//         return () => {
//             socket.off("auctionEndTimeUpdated");
//         };
//     }, [auction._id]);

//     const handleFinish = () => {
//         console.log(`Auction ${auction.title} has finished.`);
//         if (userId === auction.finalWinnerUserId) {
//             setShowWinPopup(true); // Trigger popup via state
//         }
//     };

//     return (
//         <div>
//             {auction.auctionStatus === "active" && (
//                 <CountdownTimer 
//                     className={className} 
//                     endTime={endTime} 
//                     onFinish={handleFinish} 
//                 />
//             )}
//             {/* Conditionally render WinPopUp */}
//             <WinPopUp 
//                 open={showWinPopup} 
//                 onClose={() => setShowWinPopup(false)} 
//             />
//         </div>
//     );
// }
