import { Server } from "socket.io";
import { NextResponse } from "next/server";
import { initializeWebSocket } from "@/utils/ws";

let io: Server;

const ioHandler = async (req: Request) => {
  if (!io) {
    io = new Server({
      path: "/api/socket",
      addTrailingSlash: false,
    });
    initializeWebSocket(io);

    io.on("connection", (socket) => {
      console.log("Client connected");
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  return NextResponse.json({ message: "WebSocket server is running" });
};

export { ioHandler as GET, ioHandler as POST };
