# Vercel Cron Job Setup

This document explains how to set up the Vercel Cron Job for the RSS feed fetcher.

## Prerequisites

1. A Vercel deployment of the News Hub application
2. Supabase project with the RSS feed fetcher function deployed
3. Required environment variables set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`

## Configuration

The cron job is configured in `vercel.json` to run every 10 minutes:

```json
{
  "crons": [
    {
      "path": "/api/cron/rss-fetch",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

## How It Works

1. Vercel triggers the cron job based on the schedule
2. The cron job makes a request to `/api/cron/rss-fetch`
3. The API route authenticates with Supabase using the service role key
4. The API route calls the Supabase Edge Function to fetch and cache RSS feeds

## Manual Testing

You can manually trigger the cron job by making a GET request to:

```
GET /api/cron/rss-fetch
```

## Monitoring

To monitor the cron job:

1. Go to your Vercel project dashboard
2. Navigate to the "Cron Jobs" section
3. Check the execution logs for any errors

## Troubleshooting

### Common Issues

1. **Cron job not running**
   - Check Vercel's cron job logs
   - Verify the cron job is enabled in your Vercel project settings
   - Ensure the Vercel project is not in development mode

2. **Authentication errors**
   - Verify the `SUPABASE_SERVICE_ROLE_KEY` is correctly set in Vercel
   - Ensure the service role key has the necessary permissions

3. **Rate limiting**
   - The Supabase Edge Function may be rate limited if called too frequently
   - Check the Supabase logs for rate limit errors
