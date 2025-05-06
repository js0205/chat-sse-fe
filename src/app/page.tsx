import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const preferredLanguage = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  // 重定向到默认语言路径
  return NextResponse.redirect(new URL(`/${preferredLanguage}`, 'http://localhost:3000'));
}
