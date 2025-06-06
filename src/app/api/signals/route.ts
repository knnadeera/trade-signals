/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { calculateIndicators, getSignal } from "@/utils/logic";
import { logSignal } from "@/utils/logger";
import { broadcastSignal } from "@/utils/ws";
// import { sendTelegramAlert } from "../../../utils/telegram";
import { Signal } from "@/types/signal";

const SYMBOLS = ["ETHUSDT", "BTCUSDT"];
const INTERVAL = "1h";
const LIMIT = 500;

export async function GET() {
  try {
    const signals: Signal[] = [];
    for (const SYMBOL of SYMBOLS) {
      // Fetch latest candle data
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${INTERVAL}&limit=${LIMIT}`
      );
      const data = await response.json();

      // Transform data
      const candles = data.map((c: any) => ({
        time: c[0],
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
      }));

      // Calculate indicators and generate signal
      const indicators = calculateIndicators(candles);
      const signal = getSignal(indicators);

      const signalWithPair = {
        ...signal,
        pair: SYMBOL,
      };

      // Log the signal
      await logSignal(signalWithPair);

      signals.push(signalWithPair);
    }
    // Broadcast signal to all connected clients
    broadcastSignal({
      signals,
    });
    return NextResponse.json({ signals });
  } catch (error) {
    console.error("Error generating signal:", error);
    return NextResponse.json(
      { error: "Failed to generate signal" },
      { status: 500 }
    );
  }
}
