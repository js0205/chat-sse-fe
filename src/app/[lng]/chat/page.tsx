import { ChatPageClient } from './ChatPageClient';

interface ChatPageProps {
  params: Promise<{
    lng: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { lng } = await params;

  return <ChatPageClient lng={lng} />;
}
