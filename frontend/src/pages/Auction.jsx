import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CurrentBid from '../component/auction/CurrentBid'
import RemainingTime from '../component/auction/RemainingTime';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import BidPlacementCard from '../component/auction/BidPlacementCard';
import Gallery from '../component/auction/Gallery';
import LiveBidHistory from '../component/auction/LiveBidHistory';
import AuctionCommentSection from '../component/auction/AuctionCommentSection';



const Auction = () => {
  const{id} = useParams();
  const[auction, setAuction] = useState(null);
  
  const userId = "67d580f8d47090a2d2f5c365";

  useEffect(() => {
    const fetchAuction = async () => {
        try {
            console.log(`myid ${id}`);
          
            const response = await fetch(`http://localhost:5555/auction/details/single-auction/${id}`);
            console.log(response);
            
            const data = await response.json();
            console.log(data);
            
            setAuction(data);
            
        } catch (error) {
            console.error('Error fetching auction:', error);
        }
    };

    fetchAuction();

    const socket = io("http://localhost:5555"); // move socket inside effect

  socket.on('bidUpdated', (data) => {
    if (data.auctionId === id) {
      setAuction((prevAuction) => ({
        ...prevAuction,
        currentBid: data.currentBid, // ONLY update currentBid
      }));
    }
  });

  return () => {
    socket.disconnect();
  };

}, [id]);

  return (
    <>
      <div><Header/></div>
      <div className=' w-4/5 mx-auto'>
      {auction && auction.currentBid !== undefined ? (
        <>
          {(()=>{
            const test = auction.vehicleId?.images || "Unknown";
            const imageUrl = test && test.length>0
            ?`http://localhost:5555/${test[0]}`
            :'/default-car.jpg';

            return (
              <div>
                <div>
                  <p className='text-3xl font-bold ml-26 mt-10 mb-5'>{auction.auctionTitle}</p>
                  <div className='flex mb-5'>
                    <span className='ml-26 mt-0.5'>Current Bid</span>
                    <CurrentBid auction={auction} className={'ml-2 mr-6 text-lg'}/>
                    <RemainingTime auction={auction} className={'ml-0'} userId={userId}/>
                  </div>
                  <div className='container mx-auto iterms-center  py-6 px-6 w-240'>
                    <img src={imageUrl} alt="Car" className='w-full h-auto object-cover' onError={(e) => e.target.src = '/default-car.jpg'} />
                  </div>
                  <div className='bg-white container mx-auto iterms-center  py-6 px-6 w-240 h-max'>
                    <p className='font-bold mb-6 text-xl'>About the vehicle</p>
                    <p className="text-gray-500">
                    {auction.vehicleId?.description || "Unknown"}
                    </p>
                  </div>
                </div>
                <div>
                  
                </div>
              </div>
            )
          })()}
          
        </>
      ) : (
        <h2>Loading auction...</h2>
      )}
      </div>
      {auction && auction.currentBid !== undefined ? (
        <div className='flex mx-auto w-fit'>
          <BidPlacementCard auction={auction} userId={userId}/>
          <LiveBidHistory auctionId={auction._id}/>
        </div>
      ):(
        <h2>Loading auction...</h2>
      )}
      <Gallery auction={auction}/>
      {auction ? (
        <AuctionCommentSection
          auctionId={auction._id}
          currentUser={userId}
        />
      ) : (
        <h2>Loading comments...</h2>
      )}
      <Footer/>
    </>
  )
}

export default Auction