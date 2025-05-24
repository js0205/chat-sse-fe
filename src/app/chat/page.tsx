import { ChatBox } from '@/components/ChatBox/ChatBox';
import { LoginModal } from '@/components/LoginModal/LoginModal';
import { ModelBox } from '@/components/ModelBox/ModelBox';

export default function ChatPage() {
  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* 页面标题和登录按钮 */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>AI 聊天助手</h1>
            <p className='text-gray-600'>选择模型并开始对话</p>
          </div>
          <LoginModal />
        </div>

        {/* 主要内容区域 */}
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* 左侧：模型选择 */}
          <div className='lg:col-span-1'>
            <ModelBox />
          </div>

          {/* 右侧：聊天区域 */}
          <div className='lg:col-span-2'>
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}
