import cron from 'node-cron';
import { fetchNews } from '../src/lib/newsService';

async function prefetchAll() {
  console.log(`[CRON] NewsHub cache warmup started at`, new Date().toISOString());
  try {
    // Prefetch and cache GLOBAL news
    const globalNews = await fetchNews({ region: 'global' });
    console.log(`[CRON] Global news cached:`, globalNews.articles?.length || 0);
    // Prefetch and cache LOCAL (Ethiopia) news, default (no specific source)
    const localNews = await fetchNews({ region: 'local' });
    console.log(`[CRON] Local (Ethiopia) news cached:`, localNews.articles?.length || 0);
  } catch (err: any) {
    console.error(`[CRON] Error during news prefetch:`, err);
  }
}

// Run immediately on start
prefetchAll();

// Schedule for every 5 minutes
cron.schedule('*/5 * * * *', prefetchAll);
