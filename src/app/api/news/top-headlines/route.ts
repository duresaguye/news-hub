import { NextRequest, NextResponse } from "next/server";
import { fetchNews, type FetchNewsParams } from "@/lib/newsService";

function mapParams(searchParams: URLSearchParams): FetchNewsParams {
  const params: FetchNewsParams = {};

  const tenantId = searchParams.get("tenantId") || searchParams.get("tenant");
  if (tenantId) params.tenantId = tenantId;

  const categoryId = searchParams.get("categoryId") || searchParams.get("category");
  if (categoryId) params.categoryId = categoryId;

  const search = searchParams.get("search") || searchParams.get("q");
  if (search) params.search = search;

  const pageSize = searchParams.get("pageSize");
  if (pageSize) params.pageSize = Number(pageSize);

  const page = searchParams.get("page");
  if (page) params.page = Number(page);

  return params;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const params = mapParams(searchParams);
    const newsData = await fetchNews(params);
    return NextResponse.json({
      status: "ok",
      totalResults: newsData.totalResults,
      articles: newsData.articles,
    });
  } catch (error: any) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to fetch news",
        code: error.code,
      },
      { status: 500 }
    );
  }
}
