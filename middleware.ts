import { NextRequest } from "next/server";
import { auth } from "./auth";
import { NextResponse } from "next/server";
export const config = { matcher: ['/admin/:path*'] };

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/admin')) {
      if (!session || session.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }