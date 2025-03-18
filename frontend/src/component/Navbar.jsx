import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const Navbar = () => {
  const navigate = useNavigate();
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [scoreboardType, setScoreboardType] = useState(null);

  const handleScoreboardClick = (type) => {
    setScoreboardType(type);
    setShowScoreboard(true);
    navigate(`/scoreboard/${type}`);
  };

  return (
    <nav>
      <button onClick={() => handleScoreboardClick("seller")}>Seller Scoreboard</button>
      <button onClick={() => handleScoreboardClick("buyer")}>Buyer Scoreboard</button>
    </nav>
  );
};

export default Navbar;