import { NextRequest, NextResponse } from "next/server";
import { buildLedUrl } from "@/lib/ledApiConfig";
import { setLedSession } from "@/lib/ledSession";
import type { LedAuthResponse } from "@/types/led";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { username, email, password } = body ?? {};

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
  }

  try {
    const ledResponse = await fetch(buildLedUrl("/api/auth/local/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      cache: "no-store",
    });

    const payload = (await ledResponse.json().catch(() => ({}))) as Partial<LedAuthResponse>;

    if (!ledResponse.ok || !payload?.jwt || !payload?.user) {
      const message = (payload as any)?.error?.message || "Failed to create account";
      return NextResponse.json({ error: message }, { status: ledResponse.status });
    }

    setLedSession({ token: payload.jwt, user: payload.user });

    return NextResponse.json({ user: payload.user });
  } catch (error) {
    console.error("LED register failed:", error);
    return NextResponse.json({ error: "Unable to create account right now" }, { status: 500 });
  }
}

