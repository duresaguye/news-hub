import { NextResponse } from "next/server";
import { buildLedUrl } from "@/lib/ledApiConfig";
import { getLedSession } from "@/lib/ledSession";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = getLedSession();
  if (!session?.token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(buildLedUrl(`/api/saved-newsses/${params.id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const message = (payload as any)?.error?.message || "Failed to delete saved article";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LED delete saved article failed:", error);
    return NextResponse.json({ error: "Failed to delete saved article" }, { status: 500 });
  }
}
