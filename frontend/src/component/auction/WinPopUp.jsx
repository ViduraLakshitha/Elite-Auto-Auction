// import React from 'react'
// import { Dialog } from '@headlessui/react';

// const WinPopUp = ({open,onClose}) => {
//   return (
//     <>
//         <Dialog>
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                 <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//                     <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
//                     <p className="mb-4">You have won the auction!</p>
//                     <button
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                       onClick={onClose}
//                     >
//                       Close
//                     </button>
//                 </div>
//             </div>
//         </Dialog>
//     </>
//   )
// }

// export default WinPopUp









// import React from 'react';
// import { Dialog } from '@headlessui/react';

// const WinPopUp = ({ open, onClose, auctionTitle }) => {
//     return (
//         <Dialog open={open} onClose={onClose}>
//             <div className="fixed inset-0 flex items-center justify-center bg-stone-300 bg-opacity-50 z-50">
//                 <Dialog.Panel className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
//                     <Dialog.Title className="text-3xl font-bold mb-4 text-green-600">
//                         🎉 Congratulations! 🎉
//                     </Dialog.Title>
//                     <Dialog.Description as="div" className="mb-6 space-y-2">
//                         <span className="text-lg">You have won the auction for:</span>
//                         <span className="font-semibold text-xl mt-2">"{auctionTitle}"</span>
//                     </Dialog.Description>
//                     <div className="space-y-4">
//                         <button
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
//                             onClick={onClose}
//                         >
//                             Close
//                         </button>
//                         <button
//                             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full"
//                             onClick={() => {
//                                 // Add your payment/next steps handler here
//                                 alert("Redirecting to payment...");
//                                 onClose();
//                             }}
//                         >
//                             Proceed to Payment
//                         </button>
//                     </div>
//                 </Dialog.Panel>
//             </div>
//         </Dialog>
//     );
// };

// export default WinPopUp;



import React from 'react';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const WinPopUp = ({ open, onClose, auction, auctionTitle, userId }) => {
    const navigate = useNavigate();

    const handleProceedToPayment = () => {
        navigate('/payment-final', {
            state: {
                auctionId: auction._id,
                userId: userId,
                winningBid: auction.winningBid,
            }
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            {/* Backdrop with blur and transparency */}
            <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-40" />
            
            {/* Popup container */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <Dialog.Panel className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
                    <Dialog.Title className="text-3xl font-bold mb-4 text-green-600">
                        🎉 Congratulations! 🎉
                    </Dialog.Title>
                    <Dialog.Description as="div" className="mb-6 space-y-2">
                        <span className="text-lg block">You have won the auction for:</span>
                        <span className="font-semibold text-xl block">"{auctionTitle}"</span>
                    </Dialog.Description>
                    <div className="space-y-4">
                        <button
                            className="px-6 py-2 bg-black text-white rounded-lg  transition-colors w-full"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className="px-6 py-2 bg-amber-500 text-white rounded-lg transition-colors w-full"
                            onClick={handleProceedToPayment}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default WinPopUp;









