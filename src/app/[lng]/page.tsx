import { HomeClient } from './HomeClient';

interface HomeProps {
  params: Promise<{
    lng: string;
  }>;
}

export default async function Home({ params }: HomeProps) {
  const { lng } = await params;

  return <HomeClient lng={lng} />;
}
