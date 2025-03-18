import React from 'react';
import { NotificationProvider } from "./context/NotificationContext.jsx";
import Notifications from './component/Notifications.jsx';
import "./App.css";  // Import the CSS file for styling


const App = () => {
  return (
    <NotificationProvider>
      <div className="app-container">
        <header className="header">
          <h1>Elite Auto Auctions</h1>
          <h2>Notification System</h2>
        </header>
        <main className="main-content">
          <Notifications />
        </main>
      </div>
    </NotificationProvider>
  );
};

export default App;
