import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase-server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)
  const { pathname } = request.nextUrl

  // Always allow public paths
  const publicPaths = ['/login', '/auth/callback', '/onboarding']
  if (publicPaths.some(p => pathname.startsWith(p))) return response

  // Check session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if onboarding is done (via cookie for performance)
  const paisCookie = request.cookies.get('pais')?.value
  if (!paisCookie && pathname !== '/onboarding') {
    // Check DB only if no cookie — avoid DB on every request
    const { data: profile } = await supabase
      .from('profiles')
      .select('pais, onboarding_done')
      .eq('id', session.user.id)
      .single()

    if (!profile?.onboarding_done || !profile?.pais) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Set cookie so we don't hit DB again
    const res = NextResponse.next()
    res.cookies.set('pais', profile.pais, { path: '/', maxAge: 31536000 })
    return res
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/dropi-webhook|.*\\.png$).*)'],
}
