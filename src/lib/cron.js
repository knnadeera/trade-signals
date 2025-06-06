const cron = require("node-cron");
const { Server } = require("socket.io");
const { broadcastSignal } = require("../utils/ws.js");

let io;

const initializeCron = (socketServer) => {
  io = socketServer;

  // Run every minute
  cron.schedule("30 6 * * *", async () => {
    try {
      const response = await fetch("http://localhost:3000/api/signals");
      const data = await response.json();
      broadcastSignal(data.signal);
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
};

module.exports = { initializeCron };
