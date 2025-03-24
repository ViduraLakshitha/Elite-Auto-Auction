import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "PayPal",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:5555/payments/");
        setPayments(response.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payment history.");
      }
    };

    fetchPayments();
  }, []);

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5555/payments", {
        userId: "64f1a2b3c7e6b8f9e4f5d6a1", // Replace with actual user ID
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
      });

      // Add the new payment to the list
      setPayments([...payments, response.data]);
      setPaymentData({ amount: "", paymentMethod: "PayPal" }); // Reset form
      alert("Payment successful!");
    } catch (err) {
      console.error("Error making payment:", err);
      setError("Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Payment Page</h1>

      {/* Payment Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) =>
                setPaymentData({ ...paymentData, amount: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) =>
                setPaymentData({ ...paymentData, paymentMethod: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="PayPal">PayPal</option>
              <option value="Stripe">Stripe</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Processing..." : "Make Payment"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>

      {/* Payment History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {payments.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                  Transaction ID
                </th>
                <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                  Payment Method
                </th>
                <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-700">
                    {payment.transactionId}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {payment.paymentMethod}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payment.paymentStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No payment history found.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;