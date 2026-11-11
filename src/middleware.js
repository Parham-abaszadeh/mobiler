import { NextResponse } from 'next/server';
import { COOKIE, verifyToken } from './lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login' || pathname === '/api/admin/login') return NextResponse.next();

  if (await verifyToken(req.cookies.get(COOKIE)?.value, process.env.SESSION_SECRET)) return NextResponse.next();

  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'نیاز به ورود به پنل' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
