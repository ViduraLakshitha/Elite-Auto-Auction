import { useEffect, useState } from "react";
import axios from "axios";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5555/api/vehicles/vehicle-details", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

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

  if (loading) return <div className="p-5">Loading vehicles...</div>;
  if (error) return (
    <div className="p-5 text-red-500">
      Error: {error}
      <button 
        onClick={() => window.location.reload()} 
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>
  );
  if (filteredVehicles.length === 0) return <div className="p-5">No vehicles found</div>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Vehicle List</h2>

      <input
        type="text"
        placeholder="Search vehicles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-400 rounded w-full"
      />

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Brand</th>
            <th className="border px-4 py-2">Model</th>
            <th className="border px-4 py-2">Year</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Condition</th>
            <th className="border px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td className="border px-4 py-2">{vehicle._id}</td>
              <td className="border px-4 py-2">{vehicle.brand}</td>
              <td className="border px-4 py-2">{vehicle.model}</td>
              <td className="border px-4 py-2">{vehicle.year}</td>
              <td className="border px-4 py-2">{vehicle.currentLocation}</td>
              <td className="border px-4 py-2">{vehicle.vehicleType}</td>
              <td className="border px-4 py-2">{vehicle.condition}</td>
              <td className="border px-4 py-2">{vehicle.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleList;
