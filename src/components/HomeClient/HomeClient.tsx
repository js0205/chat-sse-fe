'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeClient({ preferredLanguage }: { preferredLanguage: string }) {
  useEffect(() => {
    redirect(`/${preferredLanguage}/chat`);
  }, [preferredLanguage]);

  return null; // Render nothing while redirecting
}
