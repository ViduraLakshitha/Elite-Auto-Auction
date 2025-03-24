import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, LabelList } from "recharts";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/user/");
        setUsers(response.data);

        // Example user growth over time (you would replace this with real data)
        const growthData = [
          { name: "Jan", newUsers: 50 },
          { name: "Feb", newUsers: 100 },
          { name: "Mar", newUsers: 200 },
        ];
        setUserGrowth(growthData);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Count users by account state
  const accountStateData = [
    { name: "Approved", value: users.filter((user) => user.accountState === "Approved").length },
    { name: "Pending", value: users.filter((user) => user.accountState === "Pending").length },
    { name: "Rejected", value: users.filter((user) => user.accountState === "Rejected").length },
  ];

  // User registration stats per country
  const userByCountry = users.reduce((acc, user) => {
    acc[user.country] = (acc[user.country] || 0) + 1;
    return acc;
  }, {});

  const countryData = Object.keys(userByCountry).map((country) => ({
    name: country,
    users: userByCountry[country],
  }));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6  bg-blue-200">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - Users by Country */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Users by Country</h3>
            <BarChart width={400} height={300} data={countryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8">
                <LabelList dataKey="users" position="top" />
              </Bar>
            </BarChart>
          </div>

          {/* Pie Chart - Account State Distribution */}
          {/* <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Account State Distribution</h3>
            <PieChart width={400} height={300}>
              <Pie data={accountStateData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                {accountStateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#28a745", "#ffc107", "#dc3545"][index]} />
                ))}
              </Pie>
              <Tooltip />
              <LabelList dataKey="value" position="center" />
            </PieChart>
          </div> */}
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - User Growth Over Time */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">User Growth Over Time</h3>
            <LineChart width={400} height={300} data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" />
            </LineChart>
          </div>

          {/* Area Chart - Activity Stats */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">User Activity Stats</h3>
            <AreaChart width={400} height={300} data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="newUsers" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
