import React from "react";
import SellerScoreboard from "./SellerScoreboard"; // Import your SellerScoreboard component
import BuyerScoreboard from "./BuyerScoreboard"; // Import your BuyerScoreboard component

const ScoreboardPopup = ({ type, onClose }) => {
  return (
    <div className="popup">
      <h2>{type === "seller" ? "Seller Scoreboard" : "Buyer Scoreboard"}</h2>
      {/* Conditionally render SellerScoreboard or BuyerScoreboard */}
      {type === "seller" ? <SellerScoreboard /> : <BuyerScoreboard />}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ScoreboardPopup;