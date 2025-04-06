import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/profile',
  '/orders',
  '/checkout',
  '/cart'
];

const authRoutes = [
  '/login',
  '/register',
  '/reset-password'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  if (protectedRoutes.includes(path)) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url));
    }
  }

  if (authRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/orders',
    '/checkout',
    '/cart',
    '/login',
    '/register',
    '/reset-password'
  ]
}