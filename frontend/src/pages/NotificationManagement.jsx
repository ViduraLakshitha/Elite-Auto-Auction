import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaFileCsv, FaSpinner } from 'react-icons/fa';
import Sidebar from '../component/admin/Sidebar';
import Papa from 'papaparse';

const NotificationManagement = () => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportingCSV, setExportingCSV] = useState(false);

  // State for filters and search
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // State for form
  const [formMode, setFormMode] = useState(null); // 'add', 'edit', or null
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system',
    isGlobal: true,
    priority: 'medium',
    actionUrl: '',
    expiresAt: ''
  });

  // Notification types for dropdown
  const notificationTypes = [
    { value: 'system', label: 'System' },
    { value: 'auction', label: 'Auction' },
    { value: 'bid', label: 'Bid' },
    { value: 'payment', label: 'Payment' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'other', label: 'Other' }
  ];

  // Priority levels for dropdown
  const priorityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  // Load notifications
  useEffect(() => {
    fetchNotifications();
  }, [currentPage, search, typeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5555/notification/admin', {
        params: {
          page: currentPage,
          limit: 10,
          search,
          type: typeFilter || undefined
        }
      });
      
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.total);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
      setLoading(false);
    }
  };

  // Generate CSV Report
  const generateCSVReport = () => {
    if (notifications.length === 0) {
      alert("No notifications to export");
      return;
    }
    
    setExportingCSV(true);
    
    try {
      // Prepare data
      const csvData = notifications.map(notification => ({
        ID: notification._id,
        Title: notification.title,
        Message: notification.message,
        Type: notification.type,
        Priority: notification.priority,
        Status: notification.isGlobal ? 'Global' : 'User Specific',
        Created: formatDate(notification.createdAt),
        ExpiresAt: notification.expiresAt ? formatDate(notification.expiresAt) : 'Never',
        ActionURL: notification.actionUrl || 'N/A'
      }));
      
      // Convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `notifications_export_${new Date().getTime()}.csv`);
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open add form
  const openAddForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'system',
      isGlobal: true,
      priority: 'medium',
      actionUrl: '',
      expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
    });
    setFormMode('add');
  };

  // Open edit form
  const openEditForm = (notification) => {
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isGlobal: notification.isGlobal,
      priority: notification.priority,
      actionUrl: notification.actionUrl || '',
      expiresAt: notification.expiresAt ? new Date(notification.expiresAt).toISOString().split('T')[0] : ''
    });
    setFormMode('edit');
  };

  // Close form
  const closeForm = () => {
    setFormMode(null);
    setSelectedNotification(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formMode === 'add') {
        await axios.post('http://localhost:5555/notification/', formData);
        alert('Notification created successfully!');
      } else if (formMode === 'edit' && selectedNotification) {
        await axios.put(`http://localhost:5555/notification/${selectedNotification._id}`, formData);
        alert('Notification updated successfully!');
      }
      
      closeForm();
      fetchNotifications();
    } catch (err) {
      console.error('Error saving notification:', err);
      alert('Failed to save notification. Please try again.');
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(`http://localhost:5555/notification/${id}`);
        alert('Notification deleted successfully!');
        fetchNotifications();
      } catch (err) {
        console.error('Error deleting notification:', err);
        alert('Failed to delete notification. Please try again.');
      }
    }
  };

  // Delete all expired notifications
  const deleteExpiredNotifications = async () => {
    if (window.confirm('Are you sure you want to delete all expired notifications?')) {
      try {
        const response = await axios.delete('http://localhost:5555/notification/expired');
        alert(`${response.data.count} expired notifications deleted successfully!`);
        fetchNotifications();
      } catch (err) {
        console.error('Error deleting expired notifications:', err);
        alert('Failed to delete expired notifications. Please try again.');
      }
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  // Render form
  const renderForm = () => {
    if (!formMode) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">
            {formMode === 'add' ? 'Create New Notification' : 'Edit Notification'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                required
              />
            </div>
            
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Global checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isGlobal"
                checked={formData.isGlobal}
                onChange={handleInputChange}
                className="h-4 w-4 text-yellow-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Global notification (sent to all users)
              </label>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {priorityLevels.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Action URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action URL (optional)
              </label>
              <input
                type="text"
                name="actionUrl"
                value={formData.actionUrl}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., /auction/123"
              />
            </div>
            
            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            {/* Form buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                {formMode === 'add' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Notification Management</h2>
        
        {/* Filters and actions */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            
            {/* Type filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">All Types</option>
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={generateCSVReport}
              disabled={exportingCSV || notifications.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingCSV ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FaFileCsv className="mr-2" />
                  Export CSV
                </>
              )}
            </button>
            <button
              onClick={deleteExpiredNotifications}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Expired
            </button>
            <button
              onClick={openAddForm}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" /> New Notification
            </button>
          </div>
        </div>
        
        {/* Notifications table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title / Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <tr key={notification._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                          <div className="text-sm text-gray-500">{notification.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${notification.type === 'system' ? 'bg-blue-100 text-blue-800' : 
                              notification.type === 'auction' ? 'bg-purple-100 text-purple-800' :
                              notification.type === 'bid' ? 'bg-green-100 text-green-800' :
                              notification.type === 'payment' ? 'bg-indigo-100 text-indigo-800' :
                              notification.type === 'user' ? 'bg-yellow-100 text-yellow-800' :
                              notification.type === 'admin' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {notification.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${notification.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {notification.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${notification.isGlobal ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
                          >
                            {notification.isGlobal ? 'Global' : 'User Specific'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {notification.expiresAt ? formatDate(notification.expiresAt) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditForm(notification)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FaEdit className="inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No notifications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
            
            {/* Summary */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {notifications.length} of {totalCount} notifications
            </div>
          </>
        )}
        
        {/* Form modal */}
        {renderForm()}
      </div>
    </div>
  );
};

export default NotificationManagement; 