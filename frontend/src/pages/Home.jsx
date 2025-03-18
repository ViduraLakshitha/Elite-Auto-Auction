import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Luxury Vehicle Auction System</h1>
      <p>
        <Link to="/scoreboard/seller">View Seller Scoreboard</Link>
      </p>
      <p>
        <Link to="/scoreboard/buyer">View Buyer Scoreboard</Link>
      </p>
    </div>
  );
};

export default Home;