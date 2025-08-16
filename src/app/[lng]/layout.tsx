import { I18nProvider } from '@/components/I18nProvider';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lng: string;
  }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { lng } = await params;

  return <I18nProvider lng={lng}>{children}</I18nProvider>;
}
