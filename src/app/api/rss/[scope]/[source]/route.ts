import { NextResponse } from 'next/server';
import { fetchRssFeedServer, type LocalSource, type GlobalSource } from '@/lib/rss';

type Scope = 'local' | 'global';

const isValidSource = (scope: Scope, source: string): source is LocalSource | GlobalSource => {
  const localSources: LocalSource[] = ['addis-standard', 'reporter-ethiopia', 'ethiopian-monitor', 'ena'];
  const globalSources: GlobalSource[] = ['bbc', 'cnn', 'aljazeera', 'reuters', 'ap', 'dw'];
  
  return scope === 'local' 
    ? (localSources as string[]).includes(source)
    : (globalSources as string[]).includes(source);
};

export async function GET(
  request: Request,
  { params }: { params: { scope: string; source: string } }
) {
  const { scope, source } = params;

  // Validate scope
  if (scope !== 'local' && scope !== 'global') {
    return NextResponse.json(
      { error: 'Invalid scope. Must be "local" or "global"' },
      { status: 400 }
    );
  }

  // Validate source
  if (!isValidSource(scope, source)) {
    return NextResponse.json(
      { error: `Invalid source for ${scope} scope` },
      { status: 400 }
    );
  }

  try {
    const articles = await fetchRssFeedServer(scope, source as LocalSource | GlobalSource);
    return NextResponse.json(articles);
  } catch (error) {
    console.error(`Error in /api/rss/${scope}/${source}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
