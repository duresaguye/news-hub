import { NextResponse } from "next/server";
import { getArticleById } from "@/lib/newsService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { status: "error", message: "id parameter is required" },
      { status: 400 }
    );
  }

  try {
    const article = await getArticleById(id);

    if (article) {
      return NextResponse.json({
        status: "ok",
        article,
      });
    }

    return NextResponse.json(
      { status: "error", message: "Article not found" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to fetch article",
        code: error.code,
      },
      { status: 500 }
    );
  }
}
