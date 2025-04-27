import React from 'react'

const Gallery = ({auction}) => {
    if(!auction || !auction.vehicleId || !auction.vehicleId.images){
      return <p>No images available</p>      
    } 

    const images =auction.vehicleId.images.slice(1); //skip index 0

    if(images.length === 0){
        return <p>No addtional images available</p>
    }
  return (
    <>
        <div className='w-2/3 mx-auto mb-28'>
            <p className='text-3xl font-bold mb-12 mt-20'>Photo Gallery</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-6">
                {images.map((imagePath, index) => (
                    <img
                        key={index}
                        src={`http://localhost:5555/${imagePath}`}
                        alt={`Auction Image ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-md"
                        onError={(e) => e.target.src = '/default-car.jpg'}
                    />
                ))}
            </div>     
        </div>      
    </>
  )
}

export default Gallery