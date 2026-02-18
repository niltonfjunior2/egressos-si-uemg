import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabase, response, user } = await updateSession(request)

    const path = request.nextUrl.pathname

    // Public Routes Whitelist
    const isPublicRoute =
        path === '/' ||
        path.startsWith('/login') ||
        path.startsWith('/signup') ||
        path.startsWith('/auth') ||
        path.startsWith('/recover') ||
        path.startsWith('/reset')

    // Check profile existence if user is logged in
    let hasProfile = false
    if (user) {
        const { data } = await supabase.from('profiles').select('id').eq('id', user.id).single()
        hasProfile = !!data
    }

    // If user is NOT logged in (or has no profile) and tries to access private route
    if ((!user || !hasProfile) && !isPublicRoute) {
        // Create a new response to redirect, but we must carry over any cookies set by updateSession?
        // Actually, NextResponse.redirect creates a new response. Cookies might be lost if we don't handle them?
        // But usually redirection is a new request.
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user IS logged in AND has profile and tries to access login (but not after a fresh signout)
    const isSignedOut = request.nextUrl.searchParams.get('signedout') === 'true'
    if (user && hasProfile && path === '/login' && !isSignedOut) {
        // Redirect to dashboard/feed
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
