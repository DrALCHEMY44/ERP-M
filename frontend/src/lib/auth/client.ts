"use client"

import { createAuthClient } from "@neondatabase/auth/next"

// The Next.js adapter talks to our same-origin /api/auth proxy. Auth cookies
// therefore stay HttpOnly and the browser never stores a long-lived token.
export const authClient = createAuthClient()
