'use client';
import { deepseekMessage } from '@/app/api/chat';
import { Button, Input } from '@douyinfe/semi-ui';
import { useState } from 'react';
export const ChatBox = () => {
  const [message, setMessage] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const getDeepSeekMessage = async (userMessage: string) => {
    try {
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
                // 移除换行符和反斜杠
                fullMessage += json.choices[0].delta.content.replace(/[\n\\]/g, ' ');
                setMessage([fullMessage]);
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      getDeepSeekMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div>
      <Input value={inputValue} onChange={(value) => setInputValue(value)} />
      <Button onClick={handleSend}>发送</Button>
      {message.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
};
