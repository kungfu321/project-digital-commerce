import { NextResponse, type NextRequest } from 'next/server';

import { isAuthenticatedSVOnly } from './lib/auth';

export const config = {};

export async function middleware(request: NextRequest) {
  const { isValidToken, isValidRole } = await isAuthenticatedSVOnly(request, ['ADMIN']);
  if (request.nextUrl.pathname.startsWith('/admin/')) {
    if (isValidToken && isValidRole) {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith('/admin/api/')) {
      const response = NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 }
      );
      response.cookies.delete('token');

      return response;
    }

    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('token');

    return response;
  }

  if (request.nextUrl.pathname.startsWith('/user/') && !isValidToken) {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('token');

    return response;
  }

  if (
    (request.nextUrl.pathname.startsWith('/login')
      || request.nextUrl.pathname.startsWith('/register'))
    && isValidToken
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const ref = request.nextUrl.searchParams.get('ref');
  if (ref) {
    const response = NextResponse.next();
    response.cookies.set('ref', ref, { maxAge: 24 * 60 * 60 * 30 });

    return response;
  }

  const token = request.cookies.get('token');
  if (token && !isValidToken) {
    const response = NextResponse.next();
    response.cookies.delete('token');

    return response;
  }
}
