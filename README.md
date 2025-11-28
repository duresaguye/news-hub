# News Hub

A modern news aggregation application built with Next.js 14 and TailwindCSS.

## Features

- **Modern Stack**: Built with Next.js 14 (App Router), TypeScript, and TailwindCSS.
- **UI Components**: Utilizes Shadcn UI for a polished, accessible interface.
- **News Aggregation**: Fetches news from the LED API, supporting various categories and tenants.
- **Responsive Design**: Fully responsive layout for all devices.
- **Search & Filtering**:
  - Search by keywords.
  - Filter by categories (World, Politics, Technology, etc.).
  - Filter by tenants/sources.
- **Article View**: Dedicated article reading experience.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI + Tailwind)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Data**: React Hooks, Custom API Service

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- pnpm (or npm/yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd news-hub
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Run the development server:
    ```bash
    pnpm dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application provides internal API routes that proxy requests to the backend service:

- `GET /api/news/top-headlines`: Fetch top headlines.
- `GET /api/news/everything`: Search and filter news.
- `GET /api/news/article`: Get a specific article.

## Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and API services (`newsService.ts`, `ledNewsApi.ts`).
- `src/types`: TypeScript type definitions.

