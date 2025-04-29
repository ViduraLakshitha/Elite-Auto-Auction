import React from 'react';
import Sidebar from '../component/admin/Sidebar';
import TransportationManagement from '../component/admin/TransportationManagement';

const TransportationManagementPage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gradient-to-br from-gray-100 to-blue-200">
        <TransportationManagement />
      </div>
    </div>
  );
};

export default TransportationManagementPage; 