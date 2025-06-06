export interface MACD {
  MACD: number;
  signal: number;
  histogram: number;
}

export interface Signal {
  pair: string;
  time: string;
  signal: "LONG" | "SHORT" | "AVOID";
  entry: number;
  takeProfit: number;
  stopLoss: number;
  accuracy: number;
  rsi: number;
  macd: MACD;
  ma7: number;
  ma25: number;
  ma99: number;
  volume: number;
  avgVol10: number;
}
