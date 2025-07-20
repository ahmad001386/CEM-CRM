import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { ROUTE_MODULE_MAP, checkUserPermission } from './lib/permissions';

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Allow access to login page and API auth routes
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for token in Authorization header or cookies
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('auth-token')?.value;

  // If no token and trying to access protected routes, redirect to login
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If no token and trying to access API routes (except auth), return unauthorized
  if (!token && pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    return NextResponse.json(
      { success: false, message: 'غیر مجاز - لطفاً وارد شوید' },
      { status: 401 }
    );
  }

  // If token exists, verify it
  if (token) {
    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        // Invalid token
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { success: false, message: 'توکن نامعتبر' },
            { status: 401 }
          );
        } else {
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
      
      // Add user info to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-role', decoded.role);

      // Check permissions for dashboard routes (not API)
      if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
        const moduleNeeded = ROUTE_MODULE_MAP[pathname];
        
        if (moduleNeeded) {
          // Skip permission check for CEO
          if (decoded.role !== 'ceo' && decoded.role !== 'مدیر') {
            const hasPermission = await checkUserPermission(
              decoded.userId,
              decoded.role,
              moduleNeeded,
              'view'
            );

            if (!hasPermission) {
              // Redirect to dashboard with access denied message
              const dashboardUrl = new URL('/dashboard', request.url);
              dashboardUrl.searchParams.set('error', 'access_denied');
              dashboardUrl.searchParams.set('module', moduleNeeded);
              return NextResponse.redirect(dashboardUrl);
            }
          }
        }
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token verification failed
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { success: false, message: 'خطا در تأیید هویت' },
          { status: 401 }
        );
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};