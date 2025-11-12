# News Hub (Next.js 14 + TailwindCSS)

## Setup

1. **Environment Variables** (Set these in your Vercel project settings):
   - `GUARDIAN_API_KEY` - For The Guardian API
   - `CURRENTS_API_KEY` - For Currents API
   - `NEWS_API_KEY` - For NewsAPI
   - `DATABASE_URL` - Your Supabase database URL
   - `DIRECT_URL` - Direct connection URL for Prisma

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Database Setup**:
   - Create a new project on Supabase
   - Run the SQL migrations from `supabase/migrations/`
   - Add your Supabase connection details to Vercel environment variables

4. **Local Development**:
   ```bash
   pnpm dev
   ```

5. **Production Deployment**:
   - Connect your GitHub repository to Vercel
   - Add all required environment variables in Vercel project settings
   - Deploy!

## Features

- **App Router** - Modern Next.js 14 App Router structure (`src/app/`)
- **Multi-Source News Aggregation**
  - **Global News Flow**:
    1. NewsAPI (Primary)
    2. Currents API (Fallback 1)
    3. The Guardian API (Fallback 2)
    4. RSS Feeds (Final Fallback)
  - **Local News Flow**:
    1. Currents API with Ethiopia focus (Primary)
    2. The Guardian API (Fallback)
    3. RSS Feeds (Final Fallback)
  - **Direct Source Selection**:
    - Direct access to specific RSS sources when selected
- **Smart Caching** - Supabase-powered caching system that reduces API calls and improves performance
  - 30-minute cache duration for general news
  - 10-minute cache for specific source requests
- **Responsive Design** - Fully responsive layout built with TailwindCSS
- **Modern UI** - Accessible and intuitive user interface components
- **Advanced Search** - Comprehensive search across all news sources
- **Category Support** - Organized news by categories including World, Politics, Technology, and more

## Environment Variables

All required environment variables should be set in your Vercel project settings. The application uses the following variables:

- `GUARDIAN_API_KEY`: For The Guardian API
- `CURRENTS_API_KEY`: For Currents API
- `NEWS_API_KEY`: For NewsAPI
- `DATABASE_URL`: Supabase database connection URL
- `DIRECT_URL`: Direct database connection URL for Prisma

## Local Development

For local development, create a `.env.local` file in the root directory with the variables above.

## API Endpoints

- `GET /api/news/top-headlines` - Get top headlines
- `GET /api/news/everything` - Search news articles
- `GET /api/news/article` - Get a specific article by URL

## Caching

News data is cached for 30 minutes to reduce API usage. The cache is stored in Supabase.

## License

MIT
