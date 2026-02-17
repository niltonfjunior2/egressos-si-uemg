import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { response, user } = await updateSession(request)

    const path = request.nextUrl.pathname

    // Public Routes Whitelist
    const isPublicRoute =
        path === '/' ||
        path.startsWith('/login') ||
        path.startsWith('/signup') ||
        path.startsWith('/auth') ||
        path.startsWith('/recover') ||
        path.startsWith('/reset')

    // If user is NOT logged in and tries to access private route
    if (!user && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user IS logged in and tries to access login (but not after a fresh signout)
    const isSignedOut = request.nextUrl.searchParams.get('signedout') === 'true'
    if (user && path === '/login' && !isSignedOut) {
        // Redirect to dashboard/feed
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
