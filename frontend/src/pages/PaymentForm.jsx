import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment logic here
    alert("Payment of $100 submitted!");
    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-center mb-4">Credit Card Details</h2>
      <div className="border-dashed border-2 border-gray-200 rounded-lg p-3 mb-4 flex flex-col items-center">
        <span className="text-sm font-medium mb-2">Payment Method</span>
        <div className="flex gap-2">
          <img src="https://img.icons8.com/color/32/000000/mastercard-logo.png" alt="Mastercard" />
          <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" />
          <img src="https://img.icons8.com/color/32/000000/amex.png" alt="Amex" />
          <img src="https://img.icons8.com/color/32/000000/discover.png" alt="Discover" />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name on card</label>
          <input
            type="text"
            name="name"
            placeholder="Meet Patel"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Card number</label>
          <input
            type="text"
            name="number"
            placeholder="0000 0000 0000 0000"
            value={form.number}
            onChange={handleChange}
            maxLength={19}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">Card expiration</label>
            <select
              name="expMonth"
              value={form.expMonth}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-2"
              required
            >
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={String(i+1).padStart(2, "0")}>{String(i+1).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <select
              name="expYear"
              value={form.expYear}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-2 mt-6"
              required
            >
              <option value="">Year</option>
              {Array.from({ length: 12 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>{year}</option>
                );
              })}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Card Security Code</label>
          <input
            type="password"
            name="cvc"
            placeholder="Code"
            value={form.cvc}
            onChange={handleChange}
            maxLength={4}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold text-lg">Amount:</span>
          <span className="font-bold text-lg">$100</span>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md mt-4 hover:bg-gray-900 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 