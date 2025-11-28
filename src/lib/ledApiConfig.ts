export const LED_API_BASE_URL =
  process.env.NEXT_PUBLIC_LED_API_BASE?.replace(/\/$/, "") || "https://led.weytech.et:1338";

export const LED_SESSION_COOKIE = "led_session";

export function buildLedUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${LED_API_BASE_URL}${normalizedPath}`;
}

