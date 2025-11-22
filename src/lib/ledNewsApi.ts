const API_BASE_URL = "http://led.weytech.et:1338/api";

function buildUrl(path: string, params?: Record<string, unknown>) {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export type LedApiListResponse<T> = {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

async function apiGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LED API request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json() as Promise<T>;
}

// Entities --------------------------------------------------------------------
export type LedTenant = {
  id: number;
  documentId?: string;
  name?: string;
  Name?: string;
  slug?: string;
  [key: string]: any;
};

export type LedCategory = {
  id: number;
  documentId?: string;
  name?: string;
  Name?: string;
  slug?: string;
  [key: string]: any;
};

export type LedNewsItem = {
  id: number;
  documentId?: string;
  Title?: string;
  title?: string;
  slug?: string;
  Date?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  Summary?: string;
  summary?: string;
  Content?: string;
  content?: string;
  Image?: {
    url?: string;
    formats?: Record<string, { url?: string }>;
  };
  image?: {
    url?: string;
    formats?: Record<string, { url?: string }>;
  };
  thumbnail?: {
    url?: string;
    formats?: Record<string, { url?: string }>;
  };
  cover?: {
    url?: string;
    formats?: Record<string, { url?: string }>;
  };
  tenant?: LedTenant;
  Tenant?: LedTenant;
  category?: LedCategory;
  Category?: LedCategory;
  [key: string]: any;
};

// API Helpers -----------------------------------------------------------------
export function fetchTenants() {
  return apiGet<LedApiListResponse<LedTenant>>("/tenants");
}

export function fetchCategories() {
  return apiGet<LedApiListResponse<LedCategory>>("/categories");
}

export function fetchNewsList(params?: Record<string, unknown>) {
  return apiGet<LedApiListResponse<LedNewsItem>>("/newsses", params);
}

export function fetchNewsByTenant(tenantIdOrSlug: string | number, params?: Record<string, unknown>) {
  return apiGet<LedApiListResponse<LedNewsItem>>(`/tenant/${tenantIdOrSlug}/news`, params);
}

export function fetchNewsByCategory(categoryIdOrSlug: string | number, params?: Record<string, unknown>) {
  return apiGet<LedApiListResponse<LedNewsItem>>(`/news/category/${categoryIdOrSlug}`, params);
}

export async function fetchNewsById(id: string | number) {
  if (typeof id === "string" && !/^\d+$/.test(id)) {
    const res = await apiGet<LedApiListResponse<LedNewsItem>>("/newsses", {
      "filters[documentId][$eq]": id,
      "pagination[pageSize]": 1,
    });
    return { data: res.data?.[0] ?? null };
  }
  return apiGet<{ data: LedNewsItem | null }>(`/newsses/${id}`);
}


