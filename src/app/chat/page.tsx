import { ChatBoxFixed } from '@/components/ChatBox/ChatBoxFixed';
import { LoginModal } from '@/components/LoginModal/LoginModal';
import { ModelBox } from '@/components/ModelBox/ModelBox';

export default function ChatPage() {
  return (
    <div>
      <LoginModal />
      <h1>选择模型</h1>
      <ModelBox />
      <h1>Chat Page</h1>
      <ChatBoxFixed />
    </div>
  );
}
