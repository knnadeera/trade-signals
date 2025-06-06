"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Signal } from "@/types/signal";

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Fetched data:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default function History() {
  const { data, error, mutate, isLoading } = useSWR("/api/history", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
    revalidateOnFocus: true,
  });
  const [filter, setFilter] = useState<"ALL" | "LONG" | "SHORT">("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log("Current data:", data); // Debug log
  }, [data]);

  if (error) {
    console.error("Error state:", error); // Debug log
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Signal History</h1>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Home
            </button>
            <button
              onClick={() => mutate()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>
        <div className="text-center p-8 bg-red-100 rounded-lg">
          <p className="text-red-600">Error loading history: {error.message}</p>
          <p className="text-sm text-red-500 mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Signal History</h1>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Home
            </button>
            <button
              onClick={() => mutate()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading history data...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.signals) {
    console.log("No data available:", data); // Debug log
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Signal History</h1>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Home
            </button>
            <button
              onClick={() => mutate()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No data available</p>
          <p className="text-sm text-gray-500 mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const trades = data.signals
    .filter((s: Signal) => s.signal !== "AVOID")
    .filter((s: Signal) => (filter === "ALL" ? true : s.signal === filter));

  if (trades.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Signal History</h1>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Home
            </button>
            <button
              onClick={() => mutate()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No trading signals found</p>
          <p className="text-sm text-gray-500 mt-2">
            {filter !== "ALL" ? `Try changing the filter or ` : ""}
            Check back later for new signals
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(trades.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Signal History</h1>
        <div className="flex gap-2">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => mutate()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div>
          <label className="mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setPage(1);
            }}
            className="border rounded p-1"
          >
            <option value="ALL">All</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded-lg shadow mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentTrades}>
            <XAxis
              dataKey="time"
              tickFormatter={(t: any) => new Date(t).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(l: any) => new Date(l).toLocaleString()}
              formatter={(value: any) => [`$${value?.toFixed(2) ?? "N/A"}`, ""]}
            />
            <Line
              type="monotone"
              dataKey="entry"
              stroke="#8884d8"
              name="Entry"
            />
            <Line
              type="monotone"
              dataKey="takeProfit"
              stroke="#82ca9d"
              name="Take Profit"
            />
            <Line
              type="monotone"
              dataKey="stopLoss"
              stroke="#ff7300"
              name="Stop Loss"
            />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Recent Signals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Signal</th>
                <th className="px-4 py-2 text-right">Entry</th>
                <th className="px-4 py-2 text-right">Take Profit</th>
                <th className="px-4 py-2 text-right">Stop Loss</th>
              </tr>
            </thead>
            <tbody>
              {currentTrades.map((trade: Signal, index: number) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(trade.time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        trade.signal === "LONG"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {trade.signal}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${trade?.entry?.toFixed(2) ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${trade?.takeProfit?.toFixed(2) ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${trade?.stopLoss?.toFixed(2) ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
