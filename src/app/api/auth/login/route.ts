import { NextRequest, NextResponse } from "next/server";
import { buildLedUrl } from "@/lib/ledApiConfig";
import { setLedSession } from "@/lib/ledSession";
import type { LedAuthResponse } from "@/types/led";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { identifier, password } = body ?? {};

  if (!identifier || !password) {
    return NextResponse.json({ error: "Identifier and password are required" }, { status: 400 });
  }

  try {
    const ledResponse = await fetch(buildLedUrl("/api/auth/local"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
      cache: "no-store",
    });

    const payload = (await ledResponse.json().catch(() => ({}))) as Partial<LedAuthResponse>;

    if (!ledResponse.ok || !payload?.jwt || !payload?.user) {
      const message = (payload as any)?.error?.message || "Failed to sign in";
      return NextResponse.json({ error: message }, { status: ledResponse.status });
    }

    setLedSession({ token: payload.jwt, user: payload.user });

    return NextResponse.json({ user: payload.user });
  } catch (error) {
    console.error("LED login failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now" }, { status: 500 });
  }
}

