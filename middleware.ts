import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CHANGE: Naglagay ako ng 'default' dito
export default function middleware(request: NextRequest) {
  
  // Check kung ang user ay pupunta sa /admin pages
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  
  // Check kung nasa login page na siya (para di mag loop)
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // Check kung may "Ticket" (Cookie) siya
  const hasCookie = request.cookies.get('admin_session')

  // LOGIC:
  // Kung pupunta sa Admin, AT hindi Login page, AT walang Cookie...
  if (isAdminPath && !isLoginPage && !hasCookie) {
    // ...Sipain papunta sa Login Page
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Kung nasa Login Page siya PERO may cookie na...
  if (isLoginPage && hasCookie) {
    // ...Diretso na siya sa Dashboard
    return NextResponse.redirect(new URL('/admin/orders', request.url))
  }

  return NextResponse.next()
}

// Config
export const config = {
  matcher: '/admin/:path*',
}