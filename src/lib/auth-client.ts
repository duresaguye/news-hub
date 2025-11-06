import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
   
    baseURL: (globalThis as any).process?.env?.NEXT_PUBLIC_BASE_URL
})

export const handleLogout = async (options: {
  onSuccess?: () => void,
  onError?: (err: unknown) => void,
  onFinally?: () => void,
  router?: any,
} = {}) => {
  try {
    await authClient.signOut?.();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-session');
    }
    options.onSuccess?.();
  } catch (error) {
    options.onError?.(error);
  } finally {
    options.onFinally?.();
  }
};