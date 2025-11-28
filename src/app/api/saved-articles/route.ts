import { NextRequest, NextResponse } from "next/server";
import { buildLedUrl } from "@/lib/ledApiConfig";
import { getLedSession } from "@/lib/ledSession";

const SAVED_ENDPOINT = "/api/saved-newsses";

function requireSession() {
  const session = getLedSession();
  if (!session?.token) {
    return { errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

function normalizeCollection(payload: any) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) {
    return payload.data.map((item: { attributes: any; id: any; }) => {
      if (item?.attributes) {
        return {
          id: item.id,
          ...item.attributes,
        };
      }
      return item;
    });
  }
  return [];
}

export async function GET() {
  const { session, errorResponse } = requireSession();
  if (!session) return errorResponse!;

  try {
    const res = await fetch(buildLedUrl(SAVED_ENDPOINT), {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("LED saved articles GET failed:", res.status, errorText);
      let message = "Failed to load saved articles";
      try {
        const parsed = JSON.parse(errorText);
        message = (parsed as any)?.error?.message || message;
      } catch {
        message = errorText || message;
      }
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const payload = await res.json();
    return NextResponse.json(normalizeCollection(payload));
  } catch (error) {
    console.error("LED saved articles fetch failed:", error);
    return NextResponse.json({ error: "Failed to load saved articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, errorResponse } = requireSession();
  if (!session) return errorResponse!;

  const body = await request.json().catch(() => ({}));
  const { url, title, source, imageUrl, description, publishedAt, category } = body ?? {};

  if (!url || !title) {
    return NextResponse.json({ error: "URL and title are required" }, { status: 400 });
  }

  try {
    const res = await fetch(buildLedUrl(SAVED_ENDPOINT), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        data: {
          url,
          title,
          source,
          imageUrl,
          description,
          publishedAt,
          category,
        },
      }),
    });

    const text = await res.text();
    let payload: any = {};
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }

    if (!res.ok) {
      console.error("LED save article failed:", res.status, text);
      const message = (payload as any)?.error?.message || text || "Failed to save article";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const normalized = Array.isArray(payload?.data)
      ? normalizeCollection(payload)
      : payload?.data
      ? { id: payload.data.id, ...(payload.data.attributes || payload.data) }
      : payload;

    return NextResponse.json(normalized, { status: 201 });
  } catch (error) {
    console.error("LED save article failed:", error);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}
