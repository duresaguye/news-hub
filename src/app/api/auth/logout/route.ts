import { NextResponse } from "next/server";
import { clearLedSession } from "@/lib/ledSession";

export async function POST() {
  clearLedSession();
  return NextResponse.json({ success: true });
}

