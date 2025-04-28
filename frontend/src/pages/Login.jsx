import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Function to save user data
const saveUserData = (token, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
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

      console.log("Full login response:", res.data); // Debug log

      // Check for token in response
      if (res.data?.token) {
        // Try to get userId from different possible locations in the response
        const userId = res.data.user?._id || 
                      res.data.userId || 
                      res.data.user?.id || 
                      res.data.id;

        console.log("Extracted userId:", userId); // Debug log

        if (userId) {
          saveUserData(res.data.token, userId);
        navigate("/");  // Redirect to dashboard after login
        } else {
          // If we can't find userId, try to decode the token
          try {
            const tokenParts = res.data.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log("Token payload:", payload); // Debug log
              
              if (payload.id || payload.userId || payload._id) {
                const userIdFromToken = payload.id || payload.userId || payload._id;
                saveUserData(res.data.token, userIdFromToken);
                navigate("/");
                return;
              }
            }
          } catch (tokenError) {
            console.error("Error decoding token:", tokenError);
          }

          console.error("No userId found in response or token:", res.data);
          setError("Login failed: User ID not found in response");
        }
      } else {
        console.error("No token found in response:", res.data);
        setError("Login failed: No authentication token received");
      }
    } catch (err) {
      console.error("Login error:", err); // Debug log
      let errorMessage = "Something went wrong"; // Default error message

      if (err.response) {
        // If the server responded with an error
        errorMessage = err.response.data?.message || errorMessage;
        console.error("Server error response:", err.response.data); // Debug log
      } else if (err.request) {
        // If there was no response from the server
        errorMessage = "Network error: Could not connect to the server.";
        console.error("No server response:", err.request); // Debug log
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
