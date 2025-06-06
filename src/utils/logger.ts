import { connectToDatabase } from "../lib/db";
import Signal from "../models/Signal";

export async function logSignal(signal: any) {
  try {
    await connectToDatabase();
    await Signal.create(signal);
  } catch (error) {
    console.error("Error logging signal:", error);
  }
}
