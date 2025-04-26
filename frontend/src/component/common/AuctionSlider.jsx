import React, { useState, useEffect } from "react";

const images = [
  "../../../imgs/car1.jpg",
  "../../../imgs/car2.jpg",
  "../../../imgs/car3.jpg",
  "../../../imgs/car4.jpg",
  "../../../imgs/car5.jpg",
  "../../../imgs/car6.jpg",
  "../../../imgs/car7.jpg",
  "../../../imgs/car8.jpg",
];

const AuctionSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <img
        src={images[currentIndex]}
        alt={`Auction Car ${currentIndex + 1}`}
        className="w-full h-100 object-cover rounded-lg shadow-lg transition-all duration-500"
      />
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionSlider;