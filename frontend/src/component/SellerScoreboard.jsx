import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerScoreboard = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    // Fetch top 10 sellers from the backend
    axios.get("/api/sellers/top")
      .then((response) => {
        setSellers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sellers:", error);
      });
  }, []);

  return (
    <div className="scoreboard">
      <h2>Top Sellers</h2>
      <table>
        <thead>
          <tr>
            <th>UserID</th>
            <th>Seller Name</th>
            <th>Successful Auctions</th>
            <th>Rank</th>
            <th>Awards</th>
          </tr>
        </thead>
        <tbody>
            {Array.isArray(sellers) && sellers.length > 0 ? (
              sellers.map((seller, index) => (
                <tr key={seller._id || index}> {/* Use index as a fallback key */}
                  <td>{index + 1}</td>
                  <td>{seller.name}</td>
                  <td>{seller.successfulCompletedAuctions}</td>
                  <td>{seller.rank}</td>
                  <td>{seller.awards}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No sellers found</td>
              </tr>
            )}
          </tbody>

      </table>
      <p>Only the top 10 sellers are displayed.</p>
    </div>
  );
};

export default SellerScoreboard;