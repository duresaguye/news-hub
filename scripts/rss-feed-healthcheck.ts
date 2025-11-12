import { rssFeeds } from '../src/lib/rss';
import fetch from 'node-fetch';

async function checkFeed(name: string, url: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.log(`[FAIL] ${name}: HTTP ${res.status}`);
      return false;
    }
    console.log(`[OK  ] ${name}: ${url}`);
    return true;
  } catch (error) {
    console.log(`[FAIL] ${name}: ${url} - ${error}`);
    return false;
  }
}

(async function runAll() {
  let total = 0;
  let working = 0;
  let failed = 0;
  console.log('--- RSS Feed Health Check ---');
  for (const scope of ['local', 'global']) {
    // @ts-ignore
    const feeds = rssFeeds[scope];
    for (const [key, value] of Object.entries(feeds)) {
      // Ensure url is a string before passing to checkFeed
      const url = typeof value === 'string' ? value : '';
      if (!url) continue;
      total++;
      const ok = await checkFeed(`[${scope}] ${key}`, url);
      if (ok) working++; else failed++;
      // stagger requests to avoid burst
      await new Promise(r => setTimeout(r, 500));
    }
  }
  console.log('--- SUMMARY ---');
  console.log(`Working: ${working}, Failed: ${failed}, Total: ${total}`);
  process.exit(0);
})();
