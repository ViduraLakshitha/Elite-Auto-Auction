// import React, { useState } from "react";

// const AuctionSlider = () => {
//   // Image paths (ensure images are inside the public/img folder)
//   const images = [
//     "../../../imgs/car1.jpg",
//     "../../../imgs/car2.jpg",
//     "../../../imgs/car3.jpg",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Go to next image
//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   // Go to previous image
//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <div className="relative w-full max-w-lg mx-auto overflow-hidden">
//       <div className="flex transition-transform duration-500 ease-in-out"
//         style={{ transform: translateX(-${currentIndex * 100}%) }}>
//         {images.map((image, index) => (
//           <div key={index} className="w-full flex-shrink-0">
//             <img
//               src={image}
//               alt={Auction ${index + 1}}
//               className="w-full h-auto rounded-lg shadow-lg"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Left Button */}
//       <button
//         onClick={prevSlide}
//         className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
//       >
//         &#8249;
//       </button>

//       {/* Right Button */}
//       <button
//         onClick={nextSlide}
//         className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
//       >
//         &#8250;
//       </button>
//     </div>
//   );
// };

// export default AuctionSlider;





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
        className="w-full h-125 object-cover rounded-lg shadow-lg transition-all duration-500"
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