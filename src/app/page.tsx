"use client";

import { useEffect, useState } from "react";
import { useSignal } from "@/hooks/useSignal";
import { Signal, MACD } from "@/types/signal";

const SYMBOLS = ["ETHUSDT", "BTCUSDT"];

export default function Home() {
  const [dbSignals, setDbSignals] = useState<Signal[]>([]);
  const [page, setPage] = useState(1);
  const wsSignal = useSignal();

  const fetchLatestSignal = async () => {
    try {
      const response = await fetch("/api/history/latest");
      const data = await response.json();
      if (data.signals && Array.isArray(data.signals)) {
        setDbSignals(data.signals);
      } else {
        console.error("Invalid signals data format:", data);
        setDbSignals([]);
      }
    } catch (error) {
      console.error("Error fetching signal:", error);
      setDbSignals([]);
    }
  };

  const getSignal = async () => {
    try {
      const response = await fetch("/api/signals");
      const data = await response.json();
      setDbSignals(data.signals);
    } catch (error) {
      console.error("Error fetching signal:", error);
    }
  };

  useEffect(() => {
    fetchLatestSignal();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Latest Signal</h1>
        <div className="flex gap-2">
          <button
            onClick={getSignal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Get New Signal
          </button>
          <button
            onClick={fetchLatestSignal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh Data
          </button>
          <button
            onClick={() => (window.location.href = "/history")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            View History
          </button>
        </div>
      </div>
      <div className="flex justify-between w-full">
        {dbSignals && dbSignals.length > 0 ? (
          dbSignals.map((signal: Signal, index: number) => (
            <div
              key={index}
              className={`${
                signal?.signal === "SHORT"
                  ? "bg-red-300"
                  : signal?.signal === "LONG"
                  ? "bg-green-300"
                  : "bg-yellow-300"
              } shadow rounded-lg p-6 mb-4 w-[49%]`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Pair</p>
                  <p className="text-xl font-semibold">
                    {signal?.pair ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Signal</p>
                  <p className="text-xl font-semibold">
                    {signal?.signal ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Accuracy</p>
                  <p className="text-xl font-semibold">
                    {signal?.accuracy
                      ? (Number(signal.accuracy) * 100).toFixed(1)
                      : "N/A"}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Entry Price</p>
                  <p className="text-xl font-semibold">
                    ${signal?.entry?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Take Profit</p>
                  <p className="text-xl font-semibold">
                    ${signal?.takeProfit?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Stop Loss</p>
                  <p className="text-xl font-semibold">
                    ${signal?.stopLoss?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="text-xl font-semibold">
                    {signal?.time ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">RSI</p>
                  <p className="text-xl font-semibold">
                    {signal?.rsi?.toFixed(2) ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">MACD</p>
                  <div className="text-sm">
                    <p>MACD: {signal?.macd?.MACD?.toFixed(2) ?? "N/A"}</p>
                    <p>Signal: {signal?.macd?.signal?.toFixed(2) ?? "N/A"}</p>
                    <p>
                      Histogram: {signal?.macd?.histogram?.toFixed(2) ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Moving Averages</p>
                  <div className="text-sm">
                    <p>MA7: {signal?.ma7?.toFixed(2) ?? "N/A"}</p>
                    <p>MA25: {signal?.ma25?.toFixed(2) ?? "N/A"}</p>
                    <p>MA99: {signal?.ma99?.toFixed(2) ?? "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Volume</p>
                  <div className="text-sm">
                    <p>Current: {signal?.volume?.toFixed(2) ?? "N/A"}</p>
                    <p>Avg 10: {signal?.avgVol10?.toFixed(2) ?? "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-lg w-full">
            <p className="text-gray-600">No signals available</p>
            <p className="text-sm text-gray-500 mt-2">
              Try refreshing the data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
