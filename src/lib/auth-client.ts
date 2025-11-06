import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
   
    baseURL: (globalThis as any).process?.env?.NEXT_PUBLIC_BASE_URL
})