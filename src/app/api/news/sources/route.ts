import { NextResponse } from "next/server";
import { getSources } from "@/lib/newsService";

export async function GET() {
  try {
    const data = await getSources();
    return NextResponse.json({ status: "ok", ...data });
  } catch (error: any) {
    console.error("Error fetching news sources:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Failed to load sources",
      },
      { status: 500 }
    );
  }
}

