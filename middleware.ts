import { NextRequest } from "next/server";
import { auth } from "auth";
import { NextResponse } from "next/server";

export const config = { 
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
    '/resetPassword'
  ] 
};

const authRoutes = ['/login', '/register', '/resetPassword'];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    if (!session || session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}