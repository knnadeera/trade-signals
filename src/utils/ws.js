const { Server } = require("socket.io");

let io;

const initializeWebSocket = (socketServer) => {
  io = socketServer;
};

const broadcastSignal = (signal) => {
  console.log(signal, io);
  if (io) {
    io.emit("signal", signal);
  }
};

module.exports = {
  initializeWebSocket,
  broadcastSignal,
};
