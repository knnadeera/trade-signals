/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ti from "technicalindicators";
import moment from "moment";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// interface Signal {
//   action: "LONG" | "SHORT" | "DO_NOT_TRADE";
//   entry: number;
//   time: number;
// }

// const LEVERAGE = 30;

// Adjust TP target range for high leverage
const TP_LONG_PCT = 0.01; // +1% move
const TP_SHORT_PCT = 0.01; // -1% move

export function calculateIndicators(candles: Candle[]) {
  const close = candles.map((c) => c.close);
  const volume = candles.map((c) => c.volume);

  const rsi = ti.RSI.calculate({ period: 6, values: close });
  const macd = ti.MACD.calculate({
    values: close,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const ma7 = ti.SMA.calculate({ period: 7, values: close });
  const ma25 = ti.SMA.calculate({ period: 25, values: close });
  const ma99 = ti.SMA.calculate({ period: 99, values: close });
  const avgVol10 = ti.SMA.calculate({ period: 10, values: volume });

  return {
    rsi: rsi[rsi.length - 1],
    macd: macd[macd.length - 1],
    ma7: ma7[ma7.length - 1],
    ma25: ma25[ma25.length - 1],
    ma99: ma99[ma99.length - 1],
    volume: volume[volume.length - 1],
    avgVol10: avgVol10[avgVol10.length - 1],
    price: close[close.length - 1],
  };
}

export function getSignal(data: any) {
  const { rsi, macd, ma7, ma25, volume, avgVol10, price } = data;

  const longCond =
    rsi < 30 &&
    macd.MACD > macd.signal &&
    price > ma7 &&
    ma7 > ma25 &&
    volume > avgVol10;
  const shortCond =
    rsi > 70 &&
    macd.MACD < macd.signal &&
    price < ma7 &&
    ma7 < ma25 &&
    volume > avgVol10;

  const time = moment().format("YYYY-MM-DD HH:mm");

  if (longCond) {
    const tp = price * (1 + TP_LONG_PCT);
    return {
      time,
      signal: "LONG",
      entry: price,
      takeProfit: tp.toFixed(2),
      ...data,
    };
  }
  if (shortCond) {
    const tp = price * (1 - TP_SHORT_PCT);
    return {
      time,
      signal: "SHORT",
      entry: price,
      takeProfit: tp.toFixed(2),
      ...data,
    };
  }

  return { time, signal: "AVOID", entry: 0, takeProfit: 0, ...data };
}
