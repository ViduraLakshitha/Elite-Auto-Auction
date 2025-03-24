import React from "react";
import SellerScoreboard from "./SellerScoreboard";
import BuyerScoreboard from "./BuyerScoreboard";

const ScoreboardPopup = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
        style={{ backgroundImage: "url('/path-to-your-image.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {type === "seller" ? "Seller Scoreboard" : "Buyer Scoreboard"}
        </h2>
        <div className="overflow-y-auto max-h-96">
          {type === "seller" ? <SellerScoreboard /> : <BuyerScoreboard />}
        </div>
        <button 
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ScoreboardPopup;
