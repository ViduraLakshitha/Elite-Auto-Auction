import React, { useEffect, useState } from "react";
import axios from "axios";

const BuyerScoreboard = () => {
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    // Fetch top 10 buyers from the backend
    axios.get("/api/buyers/top")
      .then((response) => {
        setBuyers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching buyers:", error);
      });
  }, []);

  return (
    <div className="scoreboard">
      <h2>Top Buyers</h2>
      <table>
        <thead>
          <tr>
            <th>UserID</th>
            <th>Buyer Name</th>
            <th>Winning Bids</th>
            <th>Rank</th>
            <th>Awards</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(buyers) && buyers.length > 0 ? (
            buyers.map((buyer, index) => (
              <tr key={buyer._id || index}>
                <td>{index + 1}</td>
                <td>{buyer.name}</td>
                <td>{buyer.winningBids}</td>
                <td>{buyer.rank}</td>
                <td>{buyer.awards}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No buyers found</td>
            </tr>
          )}
        </tbody>

      </table>
      <p>Only the top 10 buyers are displayed.</p>
    </div>
  );
};

export default BuyerScoreboard;