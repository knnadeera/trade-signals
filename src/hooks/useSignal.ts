import { useEffect, useState } from "react";
import io from "socket.io-client";

interface MACD {
  MACD: number;
  signal: number;
  histogram: number;
}

interface Signal {
  time: string;
  signal: "LONG" | "SHORT" | "AVOID";
  entry: number;
  takeProfit: number;
  rsi: number;
  macd: MACD;
  ma7: number;
  ma25: number;
  ma99: number;
  volume: number;
  avgVol10: number;
}

export function useSignal() {
  const [signal, setSignal] = useState<Signal | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      path: "/api/socket",
    });

    // Log connection events
    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    // Listen for signals
    socket.on("signal", (newSignal: Signal) => {
      console.log("Received new signal:", newSignal);
      setSignal(newSignal);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return signal;
}
