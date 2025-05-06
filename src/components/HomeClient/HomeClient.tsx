'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function HomeClient({ preferredLanguage }: { preferredLanguage: string }) {
  useEffect(() => {
    redirect(`/${preferredLanguage}/chat`);
  }, [preferredLanguage]);

  return null; // Render nothing while redirecting
}
