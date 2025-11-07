'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useToast } from '@/components/ui/use-toast';

type BookmarkPayload = {
  url: string;
  title: string;
  source?: string;
  imageUrl?: string | null;
  description?: string | null;
  publishedAt?: string | null;
  category?: string | null;
};

type SavedRecord = {
  id: string;
  url: string;
  title?: string | null;
};

type ToggleResult = {
  success: boolean;
  bookmarked?: boolean;
  requiresAuth?: boolean;
};

export function useBookmarks() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const isAuthenticated = !!session?.user;
  const [savedMap, setSavedMap] = useState<Record<string, SavedRecord>>({});
  const [loading, setLoading] = useState(false);
  const [mutatingUrls, setMutatingUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedMap({});
      return;
    }

    let cancelled = false;

    const fetchSaved = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/saved-articles', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load saved articles');
        }

        const payload = await response.json();
        const items: any[] = Array.isArray(payload)
          ? payload
          : payload?.items ?? payload?.articles ?? [];

        if (cancelled) return;

        const nextMap: Record<string, SavedRecord> = {};
        for (const item of items) {
          if (item?.url) {
            nextMap[item.url] = {
              id: item.id,
              url: item.url,
              title: item.title,
            };
          }
        }
        setSavedMap(nextMap);
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching saved articles', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSaved();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const setMutating = useCallback((url: string, value: boolean) => {
    setMutatingUrls((prev) => {
      const next = new Set(prev);
      if (!url) {
        return next;
      }
      if (value) {
        next.add(url);
      } else {
        next.delete(url);
      }
      return next;
    });
  }, []);

  const isMutating = useCallback(
    (url?: string | null) => {
      if (!url) return false;
      return mutatingUrls.has(url);
    },
    [mutatingUrls]
  );

  const isBookmarked = useCallback(
    (url?: string | null) => {
      if (!url) return false;
      return !!savedMap[url];
    },
    [savedMap]
  );

  const toggleBookmark = useCallback(
    async (payload: BookmarkPayload): Promise<ToggleResult> => {
      const { url, title, source, imageUrl, description, publishedAt, category } = payload;

      if (!url) {
        toast({
          title: 'Missing article URL',
          description: 'Unable to save this article because a source URL is missing.',
          variant: 'destructive',
        });
        return { success: false };
      }

      if (!isAuthenticated) {
        toast({
          title: 'Sign in required',
          description: 'Create an account or sign in to save articles for later.',
        });
        router.push('/auth/login');
        return { success: false, requiresAuth: true };
      }

      if (isMutating(url)) {
        return { success: false };
      }

      setMutating(url, true);

      try {
        const existing = savedMap[url];

        if (existing) {
          const response = await fetch(`/api/saved-articles/${existing.id}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Failed to remove bookmark');
          }

          setSavedMap((prev) => {
            const next = { ...prev };
            delete next[url];
            return next;
          });

          toast({
            title: 'Removed from saved',
            description: `'${title}' has been removed from your saved articles.`,
          });

          return { success: true, bookmarked: false };
        }

        const response = await fetch('/api/saved-articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            url,
            title,
            source,
            imageUrl,
            description,
            publishedAt,
            category,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save article');
        }

        const saved = await response.json();
        const savedUrl = saved?.url ?? url;

        setSavedMap((prev) => ({
          ...prev,
          [savedUrl]: {
            id: saved?.id ?? savedUrl,
            url: savedUrl,
            title: saved?.title ?? title,
          },
        }));

        toast({
          title: 'Article saved',
          description: `'${title}' is now in your saved articles.`,
        });

        return { success: true, bookmarked: true };
      } catch (error) {
        console.error('Error toggling bookmark', error);
        toast({
          title: 'Could not save article',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
        return { success: false };
      } finally {
        setMutating(url, false);
      }
    },
    [isAuthenticated, isMutating, router, savedMap, setMutating, toast]
  );

  return {
    isAuthenticated,
    sessionPending,
    loading,
    isBookmarked,
    toggleBookmark,
    isMutating,
    savedMap,
  };
}

export type { BookmarkPayload };

