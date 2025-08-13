import axiosInstance from './axios';
export const sendMessage = async (message: string) => {
  const response = await axiosInstance.post('/v1/chat/completions', {
    model: 'deepseek-chat', // 使用 DeepSeek 聊天模型
    messages: [{ role: 'user', content: message }]
  });
  return response.data.choices[0].message.content;
};
