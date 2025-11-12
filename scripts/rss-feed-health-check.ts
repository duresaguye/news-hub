import { rssFeeds } from '../src/lib/rss';
import fetch from 'node-fetch';

async function checkFeed(url: string): Promise<{ url: string; ok: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { url, ok: false, status: res.status };
    const text = await res.text();
    // Basic check for XML/RSS root tag
    const isXml = /(<rss|<feed|<rdf:RDF)[^>]*>/i.test(text);
    if (!isXml) return { url, ok: false, status: res.status, error: 'Not XML/RSS' };
    return { url, ok: true, status: res.status };
  } catch (e: any) {
    return { url, ok: false, error: e.message };
  }
}

async function main() {
  const results: any[] = [];
  for (const scope of ['local', 'global'] as const) {
    const feeds = Object.entries(rssFeeds[scope]);
    console.log(`\n== Checking ${scope.toUpperCase()} RSS feeds ==`);
    for (const [name, url] of feeds) {
      if (!url) continue;
      const res = await checkFeed(url);
      results.push({ scope, name, ...res });
      console.log(
        `[${scope}] ${name}: ${url} ==> ${res.ok ? '✔️ OK' : '❌ FAIL'}${res.status ? ` (HTTP ${res.status})` : ''}${res.error ? ` -- ${res.error}` : ''}`
      );
    }
  }
  // Summary
  const okCount = results.filter(r => r.ok).length;
  const failCount = results.length - okCount;
  console.log(`\nSummary: ${okCount} good / ${failCount} failed RSS feeds checked.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
