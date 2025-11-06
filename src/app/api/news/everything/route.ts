import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'NEWS_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (value) params.append(key, value);
  });
  params.append('apiKey', apiKey);

  try {
    const response = await fetch(`${BASE_URL}/everything?${params.toString()}`, {
      headers: {
        'User-Agent': 'NewsHub/1.0',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData.message || errorData.error || 'Failed to fetch news', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('NewsAPI Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news', details: error.toString() },
      { status: 500 }
    );
  }
}
