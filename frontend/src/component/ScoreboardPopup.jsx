import React, { useEffect, useState } from "react";
import { getTopSellers, getTopBuyers } from "../api/api";
// import { socket } from "../services/socket";

const ScoreboardPopup = ({ type, onClose }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = type === "seller" ? await getTopSellers() : await getTopBuyers();
      setData(response.data);
    };

    fetchData();

    // // Listen for real-time updates
    // socket.on(`${type}ScoreboardUpdated`, fetchData);

    // // Cleanup on unmount
    // return () => {
    //   socket.off(`${type}ScoreboardUpdated`, fetchData);
    // };
  }, [type]);

  return (
    <div className="popup">
      <h2>{type === "seller" ? "Seller Scoreboard" : "Buyer Scoreboard"}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>{type === "seller" ? "Completed Auctions" : "Winning Bids"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.userId}>
              <td>{index + 1}</td>
              <td>{item.username}</td>
              <td>{type === "seller" ? item.successfulCompletedAuctions : item.winningBids}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ScoreboardPopup;