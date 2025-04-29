import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaEdit, FaTrash, FaCheck, FaTimes, FaDownload } from "react-icons/fa";
import Papa from "papaparse";

const TransportationManagement = () => {
  const [transportationCompanies, setTransportationCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);

  // Fetch all transportation companies
  useEffect(() => {
    fetchTransportationCompanies();
  }, []);

  const fetchTransportationCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authorized to view this page");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5555/api/transportation/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTransportationCompanies(response.data.transportationCompanies);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transportation companies:", error);
      setError("Error fetching transportation companies. Please try again later.");
      setLoading(false);
    }
  };

  // Verify a transportation company
  const handleVerifyCompany = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.patch(
        `http://localhost:5555/api/transportation/verify/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the state with the verified company
      setTransportationCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company._id === id ? { ...company, isVerified: true } : company
        )
      );

      alert("Transportation company verified successfully!");
    } catch (error) {
      console.error("Error verifying transportation company:", error);
      alert("Failed to verify transportation company. Please try again.");
    }
  };

  // Delete a transportation company
  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transportation company?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:5555/api/transportation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the deleted company from state
      setTransportationCompanies(prevCompanies =>
        prevCompanies.filter(company => company._id !== id)
      );

      alert("Transportation company deleted successfully!");
    } catch (error) {
      console.error("Error deleting transportation company:", error);
      alert("Failed to delete transportation company. Please try again.");
    }
  };

  // Edit a transportation company
  const handleEditCompany = (company) => {
    setCurrentCompany({ ...company });
    setEditMode(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompany({
      ...currentCompany,
      [name]: value
    });
  };

  // Submit updated transportation company
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `http://localhost:5555/api/transportation/${currentCompany._id}`,
        currentCompany,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Update state with the updated company
      setTransportationCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company._id === currentCompany._id ? response.data.transportation : company
        )
      );

      // Exit edit mode
      setEditMode(false);
      setCurrentCompany(null);
      
      alert("Transportation company updated successfully!");
    } catch (error) {
      console.error("Error updating transportation company:", error);
      alert("Failed to update transportation company. Please try again.");
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentCompany(null);
  };

  // Generate CSV Report
  const generateCSVReport = () => {
    if (filteredCompanies.length === 0) {
      alert("No transportation companies available to download.");
      return;
    }

    const csvData = filteredCompanies.map(company => ({
      "Company Name": company.companyName || "",
      "Registration Number": company.registrationNumber || "",
      "Tax ID": company.taxIdentificationNumber || "",
      "Address": company.address || "",
      "Country": company.country || "",
      "State": company.state || "",
      "City": company.city || "",
      "Email": company.email || "",
      "Phone": company.phoneNumber || "",
      "Website": company.website || "",
      "Verified": company.isVerified ? "Yes" : "No",
      "Status": company.isActive ? "Active" : "Inactive",
      "Created At": new Date(company.createdAt).toLocaleDateString()
    }));

    const csv = Papa.unparse(csvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transportation_companies_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Filter transportation companies based on search query
  const filteredCompanies = transportationCompanies.filter(company =>
    Object.values(company)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-full text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaTruck className="mr-2 text-yellow-600" /> Transportation Companies Management
        </h2>
        <button
          onClick={generateCSVReport}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaDownload className="mr-2" /> Export CSV
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search transportation companies..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Edit Form */}
      {editMode && currentCompany && (
        <div className="mb-8 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Edit Transportation Company</h3>
          <form onSubmit={handleUpdateCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={currentCompany.companyName || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Registration Number *</label>
              <input
                type="text"
                name="registrationNumber"
                value={currentCompany.registrationNumber || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tax ID *</label>
              <input
                type="text"
                name="taxIdentificationNumber"
                value={currentCompany.taxIdentificationNumber || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={currentCompany.email || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="text"
                name="phoneNumber"
                value={currentCompany.phoneNumber || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={currentCompany.website || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={currentCompany.address || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                name="country"
                value={currentCompany.country || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">State/Province</label>
              <input
                type="text"
                name="state"
                value={currentCompany.state || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={currentCompany.city || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-4 mt-4">
              <button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Company
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transportation Companies Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Company Name</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Registration #</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{company.companyName}</div>
                    <div className="text-xs text-gray-500">ID: {company._id.substring(0, 8)}...</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{company.registrationNumber}</div>
                    <div className="text-xs text-gray-500">TIN: {company.taxIdentificationNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{company.city}, {company.country}</div>
                    <div className="text-xs text-gray-500">{company.address}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{company.email}</div>
                    <div className="text-xs text-gray-500">{company.phoneNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          company.isVerified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {company.isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      
                      {!company.isVerified && (
                        <button
                          onClick={() => handleVerifyCompany(company._id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                          title="Verify"
                        >
                          <FaCheck />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteCompany(company._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No transportation companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransportationManagement; 