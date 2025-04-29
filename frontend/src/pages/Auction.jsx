import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CurrentBid from '../component/auction/CurrentBid'
import RemainingTime from '../component/auction/RemainingTime';
import EndDate from '../component/auction/EndDate';
import carImage from '../../imgs/BMW_i8.jpg';
import Header from '../component/common/Header';
import Footer from '../component/common/Footer';
import BidPlacementCard from '../component/auction/BidPlacementCard';
import Gallery from '../component/auction/Gallery';

const Auction = () => {
  const{id} = useParams();
  const[currentBid, setCurrentBid] = useState();
  const[bidAmount, setBidAmount] = useState(0);
  const[auction, setAuction] = useState(null);
  const[timeLeft, setTimeLeft] = useState();
  const[endDate, setEndDate] = useState();
  // const[error, setError] = useState('');

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
              <>
                <p className='text-3xl font-bold ml-26 mt-10 mb-5'>{auction.auctionTitle}</p>
                <div className='flex mb-5'>
                  <CurrentBid auction={auction} className={'ml-26 mr-6 text-lg'}/>
                  <RemainingTime auction={auction} className={'ml-0'}/>
                </div>
                <div className=' container mx-auto iterms-center  py-6 px-6 w-240'>
                  {/* <img src={carImage} alt="Car" /> */}
                  <img src={imageUrl} alt="Car" className='w-full h-auto object-cover' onError={(e) => e.target.src = '/default-car.jpg'} />
                </div>
                <div className='bg-white container mx-auto iterms-center  py-6 px-6 w-240 h-max'>
                  <p className='font-bold mb-6 text-xl'>About the vehicle</p>
                  <p className="text-gray-500">
                    {auction.vehicleId?.description || "Unknown"}
                  </p>
                </div>
              </>
            )
          })()}
          
        </>
      ) : (
        <h2>Loading auction...</h2>
      )}
      </div>
      {auction && auction.currentBid !== undefined ? (
        <div>
          <BidPlacementCard auction={auction} userId={userId}/>
        </div>
      ):(
        <h2>Loading auction...</h2>
      )}
      <Gallery auction={auction}/>
      
      <Footer/>
    </>
  )
}

export default Auction