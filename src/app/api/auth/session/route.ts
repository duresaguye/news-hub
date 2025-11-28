import { NextResponse } from "next/server";
import { getLedSession } from "@/lib/ledSession";

export async function GET() {
  const session = getLedSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}

