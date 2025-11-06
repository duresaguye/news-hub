# News Hub (Next.js 14 + TailwindCSS)

## Setup

1. Make sure you have your NewsAPI key.
2. Create a `.env.local` in the root with:

```
NEWS_API_KEY=your_newsapi_key_here
```

3. Install dependencies:

```
npm install
# or
pnpm install
```

4. Run dev server:

```
npm run dev
# or
pnpm dev
```


## Features
- App Router structure (`src/app/`)
- News fetching (via Next.js API routes to NewsAPI)
- TailwindCSS styling
- All UI components / pages migrated from React/Vite
- Supports Home, Trending, World, Politics, Technology, Search views
- Navbar uses next/link

