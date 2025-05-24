'use client';
import { deepseekMessage } from '@/app/api/chat';
import { Button, TextArea } from '@douyinfe/semi-ui';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const ChatBoxFixed = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const newMessage: Message = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      <div
        style={{
          display: 'flex',
          height: '600px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#666'
        }}
      >
        <div>🔄 正在初始化聊天...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa'
      }}
    >
      {/* 上方：固定高度的聊天展示区域 */}
      <div
        style={{
          height: '480px', // 固定高度
          padding: '16px',
          overflow: 'auto',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        {messages.length === 0 ? (
          // 没有消息时显示空状态
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#999',
              fontSize: '16px',
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <div>开始对话吧！</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>向AI提出你的问题</div>
            </div>
          </div>
        ) : (
          // 有消息时显示聊天记录 - 按时间顺序垂直排列
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '100%'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  width: '100%',
                  padding: '8px 0'
                }}
              >
                {/* 用户消息样式 */}
                {msg.type === 'user' && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        backgroundColor: '#f0f8ff',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        borderRight: '4px solid #007AFF',
                        maxWidth: '80%',
                        flexDirection: 'row-reverse'
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#007AFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          flexShrink: 0,
                          color: '#ffffff'
                        }}
                      >
                        👤
                      </div>
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '6px',
                            justifyContent: 'flex-end'
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#666'
                            }}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span
                            style={{
                              fontWeight: 'bold',
                              color: '#007AFF',
                              fontSize: '14px'
                            }}
                          >
                            用户
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.5',
                            color: '#333',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            textAlign: 'right'
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI消息样式 */}
                {msg.type === 'ai' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      backgroundColor: '#f8f9fa',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #28a745'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#28a745',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        flexShrink: 0
                      }}
                    >
                      🤖
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px'
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: '#28a745',
                            fontSize: '14px'
                          }}
                        >
                          AI助手
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#666'
                          }}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#333',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
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
      <div
        style={{
          height: '120px', // 固定高度
          padding: '16px',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}
        >
          <div style={{ flex: 1 }}>
            <TextArea
              value={inputValue}
              onChange={(value) => setInputValue(value)}
              onKeyPress={handleKeyPress}
              placeholder='输入消息... (Enter发送，Shift+Enter换行)'
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                resize: 'none',
                padding: '8px 12px'
              }}
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
            style={{
              height: '40px',
              borderRadius: '8px',
              paddingLeft: '20px',
              paddingRight: '20px',
              minWidth: '80px'
            }}
          >
            {isLoading ? '发送中' : '发送'}
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#999'
          }}
        >
          <div>{isLoading && '🤖 AI正在思考...'}</div>
          <div>{inputValue.length}/1000</div>
        </div>
      </div>
    </div>
  );
};
