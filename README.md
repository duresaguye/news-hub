# News Hub (Vite + React + TypeScript)

This app integrates with NewsAPI to fetch real news content with a clean UI.

## Setup

1) Install dependencies and copy environment file:

```
pnpm i
cp .env.example .env
```

2) Edit `.env` and set your key:

```
VITE_NEWS_API_KEY=your_newsapi_key_here
```

Get an API key from the NewsAPI site: `https://newsapi.org/`.

3) Start dev server:

```
pnpm dev
```

## NewsAPI usage

- Home uses Top Headlines (e.g., `country=us`).
- Trending uses Everything sorted by popularity (e.g., `q=technology&sortBy=popularity`).
- Search uses Everything with query + filters and maps sortBy:
  - recent -> publishedAt
  - popular -> popularity
  - relevant -> relevancy

Reference endpoints from NewsAPI:
- Top headlines: `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=API_KEY`
- Everything: `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=API_KEY`

