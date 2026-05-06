// ─────────────────────────────────────────────────────────────────
// COMPATIBILITY SHIM — supabase-browser.ts
// Exports createServerSupabase so older files that import from here
// continue to work. This resolves the Vercel build error:
// "Export createServerSupabase doesn't exist in target module"
// ─────────────────────────────────────────────────────────────────
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Used by API routes and server components
export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Record<string, unknown>)
          )
        } catch { /* Server Component — ignore */ }
      },
    },
  })
}

// Used by middleware
export function createServerSupabaseMiddleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as Record<string, unknown>)
        )
      },
    },
  })
  return { supabase, response }
}

// Browser client alias  
export { createClient as supabaseBrowser } from '@/lib/supabase'
