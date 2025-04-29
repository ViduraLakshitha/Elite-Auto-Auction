import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    address: "",
    country: "",
    email: "",
    mobileNo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      console.log("Sending registration request:", formData);

      const res = await axios.post("http://localhost:5555/api/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration response:", res.data);

      if (res.data?.message) {
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = "Network error: Could not connect to the server.";
      }
      console.error("Full Error Object:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Account</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobileNo"
              placeholder="Mobile Number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
