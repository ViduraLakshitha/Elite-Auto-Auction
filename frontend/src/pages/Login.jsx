import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const saveUserData = (token, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5555/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.token) {
        const userId = res.data.user?._id || res.data.userId || res.data.user?.id || res.data.id;

        if (userId) {
          saveUserData(res.data.token, userId);
          navigate("/");
        } else {
          try {
            const tokenParts = res.data.token.split(".");
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userIdFromToken = payload.id || payload.userId || payload._id;
              if (userIdFromToken) {
                saveUserData(res.data.token, userIdFromToken);
                navigate("/");
                return;
              }
            }
          } catch (tokenError) {
            console.error("Error decoding token:", tokenError);
          }
          setError("Login failed: User ID not found in response");
        }
      } else {
        setError("Login failed: No authentication token received");
      }
    } catch (err) {
      let errorMessage = "Something went wrong";
      if (err.response) errorMessage = err.response.data?.message || errorMessage;
      else if (err.request) errorMessage = "Network error: Could not connect to the server.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="bg-opacity-80 bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-600">
        <h1 className="text-3xl font-serif font-bold text-center mb-4 text-yellow-500">
          Elite Auto Auction Login
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6 italic">
          Access Your Account • Classical Elegance
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-yellow-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="pl-10 w-full p-2 bg-gray-800 border border-yellow-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-yellow-400" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="pl-10 w-full p-2 bg-gray-800 border border-yellow-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
