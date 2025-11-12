# News Hub (Next.js 14 + TailwindCSS)

## Setup

1. Copy the `.env.example` file to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

2. Get your API keys:
   - [Currents API](https://currentsapi.services/en) - For global and local news coverage
   - [The Guardian API](https://open-platform.theguardian.com/) - As a fallback news source
   - [Supabase](https://supabase.com/) - For caching and database

3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

4. Set up the database:
   - Create a new project on Supabase
   - Run the SQL migration from `supabase/migrations/20250101000000_create_news_cache_table.sql`
   - Add your Supabase URL and anon key to `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Features

- **App Router** - Modern Next.js 14 App Router structure (`src/app/`)
- **News Fetching** - Multiple news sources with automatic fallback
  - Primary: Currents API
  - Fallback: The Guardian API
- **Caching** - Supabase-powered caching to reduce API calls
- **Responsive Design** - Built with TailwindCSS
- **UI Components** - Modern, accessible components
- **Search & Filter** - Search across multiple news sources
- **Categories** - Supports various news categories (World, Politics, Technology, etc.)

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

- `GET /api/news/top-headlines` - Get top headlines
- `GET /api/news/everything` - Search news articles
- `GET /api/news/article` - Get a specific article by URL

## Caching

News data is cached for 30 minutes to reduce API usage. The cache is stored in Supabase.

## License

MIT
