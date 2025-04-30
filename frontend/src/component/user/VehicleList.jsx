import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTrash, FaSpinner, FaFileCsv } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [exportingCSV, setExportingCSV] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };
        
        // Add authentication token if available
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get("http://localhost:5555/api/vehicles/vehicle-details", config);

        if (!response.data) {
          throw new Error("No data received from server");
        }
        setVehicles(response.data.vehicles);
        setFilteredVehicles(response.data.vehicles);
        setError(null);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError(error.message || "Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    const filtered = vehicles.filter(vehicle =>
      Object.values(vehicle).some(val =>
        typeof val === "string" && val.toLowerCase().includes(keyword)
      )
    );
    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete vehicles");
      navigate("/login");
      return;
    }
    
    setDeletingId(id);
    try {
      const response = await axios.delete(`http://localhost:5555/api/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Delete success:", response.data);
      setVehicles(prev => prev.filter(vehicle => vehicle._id !== id));
      setFilteredVehicles(prev => prev.filter(vehicle => vehicle._id !== id));
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message || error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        alert("Failed to delete vehicle. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };
  
  // Generate CSV Report
  const generateCSVReport = () => {
    if (filteredVehicles.length === 0) {
      alert("No vehicles to export");
      return;
    }
    
    setExportingCSV(true);
    
    try {
      // Prepare data
      const csvData = filteredVehicles.map(vehicle => ({
        ID: vehicle._id,
        Brand: vehicle.brand,
        Model: vehicle.model,
        Year: vehicle.year,
        Location: vehicle.currentLocation,
        Type: vehicle.vehicleType,
        Condition: vehicle.condition,
        Description: vehicle.description || "N/A",
        StartingPrice: vehicle.initialVehiclePrice || "N/A"
      }));
      
      // Convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vehicle_inventory_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV export error:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setExportingCSV(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-2xl font-serif text-amber-100 flex items-center">
        <FaSpinner className="animate-spin mr-3" />
        Loading Luxury Vehicles...
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="text-xl text-red-400 font-serif mb-4">Error: {error}</div>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2 px-6 rounded-full shadow transition-all duration-300"
      >
        Retry
      </button>
    </div>
  );

  if (filteredVehicles.length === 0) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-xl font-serif text-amber-100">
        No luxury vehicles found matching your criteria
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-800">
            Luxury and Classical Vehicle Collection
          </h2>
          
          {/* CSV Export Button */}
          <button 
            onClick={generateCSVReport}
            disabled={exportingCSV}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {exportingCSV ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FaFileCsv className="mr-2" />
                Export to CSV
              </>
            )}
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search our luxury collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-200 placeholder-gray-400"
          />
        </div>

        {/* Vehicle Table */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-700">
          <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 uppercase text-sm font-serif">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Brand</th>
                <th className="px-6 py-4 text-left">Model</th>
                <th className="px-6 py-4 text-left">Year</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Condition</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 font-light divide-y divide-gray-700">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-gray-750 transition duration-150">
                  <td className="px-6 py-4 font-mono text-sm">{vehicle._id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 font-medium">{vehicle.brand}</td>
                  <td className="px-6 py-4">{vehicle.model}</td>
                  <td className="px-6 py-4">{vehicle.year}</td>
                  <td className="px-6 py-4">{vehicle.currentLocation}</td>
                  <td className="px-6 py-4 capitalize">{vehicle.vehicleType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.condition === 'excellent' ? 'bg-green-900 text-green-300' :
                      vehicle.condition === 'good' ? 'bg-amber-900 text-amber-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {vehicle.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      disabled={deletingId === vehicle._id}
                      className="flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg text-xs font-bold transition-all duration-200 shadow disabled:opacity-50"
                    >
                      {deletingId === vehicle._id ? (
                        <FaSpinner className="animate-spin mr-1" />
                      ) : (
                        <FaTrash className="mr-1" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VehicleList;