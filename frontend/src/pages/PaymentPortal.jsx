import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPortal = () => {
  const location = useLocation();
  const { auctionId, userId, winningBid } = location.state || {};

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [activeCard, setActiveCard] = useState('VISA');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment data:', {
      ...formData,
      auctionId,
      userId,
      amount: winningBid
    });
    // Submit to your backend
    // Handle payment submission logic here
    console.log('Payment submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-25">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Credit Card Details</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-700 mb-2 underline">Payment Summary</h3>
        <p className="text-gray-600 mt-2">Amount: ${winningBid}</p>
        <p className='text-sm text-red-500 mt-2'>(Additional 5% of this amount will be charged as a service fee)</p>
        <p  className="text-gray-600 mt-2">Service Fee: ${((winningBid*5)/100)}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Payment Method</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            className={`px-4 py-2 rounded-md border ${activeCard === 'VISA' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            onClick={() => setActiveCard('VISA')}
          >
            VISA
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md border ${activeCard === 'MASTERCARD' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
            onClick={() => setActiveCard('MASTERCARD')}
          >
            MASTERCARD
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="Kelly Ankara"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            maxLength="19"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card expiration</label>
            <div className="flex space-x-2">
              <select
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <select
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Security Code</label>
            <div className="flex items-center">
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="cvv"
                maxLength="3"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 w-4 focus:ring-green-500"
                required
              />
              <span className="ml-2 text-green-600 cursor-help" title="3-digit code on back of card">?</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentPortal;