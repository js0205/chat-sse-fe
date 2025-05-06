import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const supportedLanguages = ['en', 'zh']; // 支持的语言列表

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 如果访问根路径，重定向到默认语言
  if (pathname === '/') {
    const cookieStore = request.cookies;
    const preferredLanguage = cookieStore.get('NEXT_LOCALE')?.value || 'en';
    return NextResponse.redirect(new URL(`/${preferredLanguage}`, request.url));
  }

  // 如果路径中已经包含语言，直接继续
  const pathnameHasLanguage = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );
  if (pathnameHasLanguage) {
    return NextResponse.next();
  }

  // 重定向到默认语言路径
  const preferredLanguage = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  return NextResponse.redirect(new URL(`/${preferredLanguage}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
