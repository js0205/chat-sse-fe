import { DEEPSEEK_API_KEY } from '@/configs';
import axiosInstance from '@/lib/axios';

interface IModelItem {
  id: string;
  object: string;
  owned_by: number;
}
const getModels = async (): Promise<IModelItem[]> => {
  const res = await axiosInstance('/models', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return res.data as IModelItem[];
};
const deepseekMessage = async (userMessage: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        model: 'deepseek-chat',
        frequency_penalty: 0,
        max_tokens: 2048,
        presence_penalty: 0,
        response_format: {
          type: 'text'
        },
        stop: null,
        stream: true,
        stream_options: null,
        temperature: 1,
        top_p: 1,
        tools: null,
        tool_choice: 'none',
        logprobs: false,
        top_logprobs: null
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log('API Response:', res);
    return res;
  } catch (error) {
    console.error('Error in deepseekMessage:', error);
    throw error;
  }
};

export { deepseekMessage, getModels };
