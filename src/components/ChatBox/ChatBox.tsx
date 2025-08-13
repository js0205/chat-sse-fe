'use client';
import { deepseekMessage } from '@/apis';
import { Button, TextArea } from '@douyinfe/semi-ui';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  // 确保组件只在客户端渲染时显示动态内容
  useEffect(() => {
    setMounted(true);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (type: 'user' | 'ai', content: string) => {
    if (!mounted) return '';

    // 使用计数器生成唯一ID，避免服务端和客户端不一致
    messageIdCounter.current += 1;
    const newMessage: Message = {
      id: `${type}_${messageIdCounter.current}`,
      type,
      content,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateAIMessage = (messageId: string, content: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg)));
  };

  const getDeepSeekMessage = async (userMessage: string) => {
    try {
      setIsLoading(true);

      // 添加用户消息
      addMessage('user', userMessage);

      // 创建AI消息占位符
      const aiMessageId = addMessage('ai', '正在思考...');

      const response = await deepseekMessage(userMessage);
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream ended');
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        chunk.split('\n').forEach((line) => {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const json = JSON.parse(data);
              if (json.choices[0].delta.content) {
                fullMessage += json.choices[0].delta.content;
                updateAIMessage(aiMessageId, fullMessage);
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage('ai', '抱歉，发生了错误，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      getDeepSeekMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 在组件挂载前显示加载状态，避免 hydration 错误
  if (!mounted) {
    return (
      <div className='flex h-[600px] border border-gray-200 rounded-lg items-center justify-center text-base text-gray-600'>
        <div>🔄 正在初始化聊天...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[600px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50'>
      {/* 上方：固定高度的聊天展示区域 */}
      <div className='h-[480px] p-4 overflow-auto bg-white border-b border-gray-200'>
        {messages.length === 0 ? (
          // 没有消息时显示空状态
          <div className='flex items-center justify-center h-full text-gray-400 text-base italic text-center'>
            <div>
              <div className='text-5xl mb-4'>💬</div>
              <div>开始对话吧！</div>
              <div className='text-sm mt-2'>向AI提出你的问题</div>
            </div>
          </div>
        ) : (
          // 有消息时显示聊天记录 - 按时间顺序垂直排列
          <div className='flex flex-col gap-3 min-h-full'>
            {messages.map((msg) => (
              <div key={msg.id} className='w-full py-2'>
                {/* 用户消息样式 */}
                {msg.type === 'user' && (
                  <div className='flex justify-end w-full'>
                    <div className='flex items-start gap-3 bg-blue-50 p-3 rounded-lg border-r-4 border-blue-500 max-w-[80%] flex-row-reverse'>
                      <div className='w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-base flex-shrink-0 text-white'>
                        👤
                      </div>
                      <div className='flex-1 text-right'>
                        <div className='flex items-center gap-2 mb-1.5 justify-end'>
                          <span className='text-xs text-gray-600'>
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className='font-bold text-blue-500 text-sm'>用户</span>
                        </div>
                        <div className='text-sm leading-6 text-gray-800 break-words whitespace-pre-wrap text-right'>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI消息样式 */}
                {msg.type === 'ai' && (
                  <div className='flex items-start gap-3 bg-gray-50 p-3 rounded-lg border-l-4 border-green-500'>
                    <div className='w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-base flex-shrink-0'>
                      🤖
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1.5'>
                        <span className='font-bold text-green-500 text-sm'>AI助手</span>
                        <span className='text-xs text-gray-600'>
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className='text-sm leading-6 text-gray-800 break-words whitespace-pre-wrap'>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* 滚动锚点 */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 下方：用户输入区域 */}
      <div className='h-[120px] p-4 bg-white flex flex-col gap-2'>
        <div className='flex gap-3 items-end'>
          <div className='flex-1'>
            <TextArea
              value={inputValue}
              onChange={(value) => setInputValue(value)}
              onKeyPress={handleKeyPress}
              placeholder='输入消息... (Enter发送，Shift+Enter换行)'
              className='border border-gray-300 rounded-lg resize-none px-3 py-2'
              disabled={isLoading}
              autosize={{ minRows: 1, maxRows: 3 }}
              maxLength={1000}
            />
          </div>

          <Button
            onClick={handleSend}
            type='primary'
            disabled={!inputValue.trim() || isLoading}
            loading={isLoading}
            className='h-10 rounded-lg px-5 min-w-[80px]'
          >
            {isLoading ? '发送中' : '发送'}
          </Button>
        </div>

        <div className='flex justify-between items-center text-xs text-gray-400'>
          <div>{isLoading && '🤖 AI正在思考...'}</div>
          <div>{inputValue.length}/1000</div>
        </div>
      </div>
    </div>
  );
};
