import { useEffect, useMemo, useState } from "react";
import { fetchEverything, fetchTopHeadlines, mapNewsArticleToCard, type EverythingParams, type TopHeadlinesParams } from "./newsApi";

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useTopHeadlines(params: TopHeadlinesParams) {
  const [state, setState] = useState<FetchState<ReturnType<typeof mapNewsArticleToCard>[]>>({ data: null, loading: false, error: null });

  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetchTopHeadlines(stableParams);
        const mapped = res.articles.map(mapNewsArticleToCard);
        if (!cancelled) setState({ data: mapped, loading: false, error: null });
      } catch (e: any) {
        if (!cancelled) setState({ data: null, loading: false, error: e?.message ?? "Failed to fetch news" });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [stableParams]);

  return state;
}

export function useEverything(params: EverythingParams) {
  const [state, setState] = useState<FetchState<ReturnType<typeof mapNewsArticleToCard>[]>>({ data: null, loading: false, error: null });
  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetchEverything(stableParams);
        const mapped = res.articles.map(mapNewsArticleToCard);
        if (!cancelled) setState({ data: mapped, loading: false, error: null });
      } catch (e: any) {
        if (!cancelled) setState({ data: null, loading: false, error: e?.message ?? "Failed to fetch news" });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [stableParams]);

  return state;
}


