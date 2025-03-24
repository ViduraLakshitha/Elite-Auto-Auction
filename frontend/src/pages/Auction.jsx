import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import CurrentBid from '../component/auction/CurrentBid'
import RemainingTime from '../component/auction/RemainingTime';
import EndDate from '../component/auction/EndDate';

const Auction = () => {
  const{id} = useParams();
  const[currentBid, setCurrentBid] = useState();
  const[bidAmount, setBidAmount] = useState(0);
  const[auction, setAuction] = useState(null);
  const[timeLeft, setTimeLeft] = useState();
  const[endDate, setEndDate] = useState();
  // const[error, setError] = useState('');

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
      <div>This is Auction page</div>
      {auction && auction.currentBid !== undefined ? (
        <>
          <div>
            <p>{auction.auctionTitle}</p>
            <CurrentBid auction={auction} />
            <RemainingTime auction={auction} />
            <p>{auction.endDateTime}</p>
            <EndDate auction={auction}/>
          </div>
        </>
      ) : (
        <h2>Loading auction...</h2>
      )}
      
    </>
  )
}

export default Auction