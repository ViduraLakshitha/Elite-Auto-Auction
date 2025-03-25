import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Function to save JWT Token (to localStorage or cookies)
const saveToken = (token) => {
  localStorage.setItem("token", token);
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset any previous error message
    setLoading(true);  // Set loading state to true

    try {
      const res = await axios.post("http://localhost:5555/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data?.token) {
        saveToken(res.data.token);  // Save the JWT token if login is successful
        navigate("/dashboard");  // Redirect to dashboard after login
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      let errorMessage = "Something went wrong"; // Default error message

      if (err.response) {
        // If the server responded with an error
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // If there was no response from the server
        errorMessage = "Network error: Could not connect to the server.";
      }

      setError(errorMessage);  // Set the error message to be displayed
    } finally {
      setLoading(false);  // Set loading state to false
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
