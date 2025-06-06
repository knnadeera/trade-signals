"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

interface UpdateData {
  timestamp: string;
  // Add your data types here
}

export default function RealTimeUpdates() {
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      await fetch("/api/socket");
      const socket = io();

      socket.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      socket.on("update", (data: UpdateData) => {
        setUpdates((prev) => [data, ...prev].slice(0, 10)); // Keep last 10 updates
      });

      setSocket(socket);
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Real-Time Updates</h2>
      <div className="space-y-2">
        {updates.map((update, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded">
            <p>Timestamp: {new Date(update.timestamp).toLocaleString()}</p>
            {/* Add your data display here */}
          </div>
        ))}
      </div>
    </div>
  );
}
