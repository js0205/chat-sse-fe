'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';

async function getPreferredLanguage() {
  const cookieStore = await cookies();
  return cookieStore.get('NEXT_LOCALE')?.value || 'en';
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    getPreferredLanguage().then(preferredLanguage => {
      console.log('Preferred Language:', preferredLanguage);
      router.push(`/${preferredLanguage}/chat`);
    }).catch(error => {
      console.error('Error:', error);
    });
  }, []);

  return null;
}
