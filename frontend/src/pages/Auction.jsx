import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5555');

const Auction = () => {
  const{id} = useParams();
  const[currentBid, setCurrentBid] = useState(0);
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
            
            setAuction(data);
            
            setCurrentBid(data.currentBid);
        } catch (error) {
            console.error('Error fetching auction:', error);
        }
    };

    fetchAuction();

    // socket.on('bidUpdated', (data) => {
    //     if (data.auctionId === auctionId) {
    //         setCurrentBid(data.currentBid);
    //     }
    // });

    // return () => {
    //     socket.off('bidUpdated');
    // };
}, [id]);

  return (
    <>
      <div>This is Auction page</div>
      <h1 className='font-bold'>Place Bid</h1>
      <p>{currentBid}</p>
    </>
  )
}

export default Auction