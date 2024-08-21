import React, { useEffect, useState } from 'react';
import './styles.css'; // Adjust path as needed

const WebSocketClient = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3003');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const message = event.data;
      // Add new notification to the state
      setNotifications(prevNotifications => [...prevNotifications, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {notifications.length > 0 && (
        <div className="notification-container">
          {notifications.map((notification, index) => (
            <div key={index} className="notification">
              {notification}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebSocketClient;
