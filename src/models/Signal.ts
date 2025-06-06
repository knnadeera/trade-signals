import mongoose from "mongoose";

const signalSchema = new (mongoose as any).Schema({
  pair: { type: String, required: true },
  time: { type: String, required: true },
  signal: { type: String, required: true },
  entry: { type: Number, required: true },
  takeProfit: { type: Number, required: true },
  stopLoss: { type: Number, required: true },
  rsi: { type: Number, required: true },
  macd: { type: Object, required: true },
  ma7: { type: Number, required: true },
  ma25: { type: Number, required: true },
  ma99: { type: Number, required: true },
  volume: { type: Number, required: true },
  avgVol10: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  // Add other fields as needed
});

const Signal =
  (mongoose as any).models.Signal ||
  (mongoose as any).model("Signal", signalSchema);
export default Signal;
