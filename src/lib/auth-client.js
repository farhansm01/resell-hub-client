import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL
})

export const { signIn, signUp, useSession, signOut } = authClient;

// get JWT token for sending with API requests
export async function getAuthToken() {
  try {
    const res = await fetch('/api/auth/token', {
      credentials: 'include'
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.token || null
  } catch {
    return null
  }
}