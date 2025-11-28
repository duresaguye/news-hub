import { cookies } from "next/headers";
import type { LedUser } from "@/types/led";
import { LED_SESSION_COOKIE } from "./ledApiConfig";

export type LedSession = {
  token: string;
  user: LedUser;
};

function encodeSession(session: LedSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSession(value?: string | null): LedSession | null {
  if (!value) return null;
  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    return JSON.parse(json) as LedSession;
  } catch (error) {
    console.error("Failed to decode LED session", error);
    return null;
  }
}

export function setLedSession(session: LedSession) {
  cookies().set({
    name: LED_SESSION_COOKIE,
    value: encodeSession(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearLedSession() {
  cookies().delete(LED_SESSION_COOKIE);
}

export function getLedSession(): LedSession | null {
  const value = cookies().get(LED_SESSION_COOKIE)?.value;
  return decodeSession(value);
}

export function readLedSessionFromValue(value?: string | null) {
  return decodeSession(value);
}

