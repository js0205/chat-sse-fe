'use client';
import { useTranslation } from 'react-i18next';

interface HomeClientProps {
  lng: string;
}

export function HomeClient({ lng }: HomeClientProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>当前语言: {lng}</p>
    </div>
  );
}
