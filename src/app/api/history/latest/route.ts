import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import Signal from "../../../../models/Signal";

export async function GET() {
  await connectToDatabase();
  const signals = await Signal.find({}).sort({ time: -1 }).limit(2);
  return NextResponse.json({ signals });
}
