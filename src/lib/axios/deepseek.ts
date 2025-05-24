import { DEEPSEEK_API_KEY } from '@/configs';
import axios from 'axios';

// DeepSeek API 专用实例
const deepseekAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DEEPSEEK_BASE_URL,
  timeout: 30000, // AI请求可能需要更长时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加认证
deepseekAxios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${DEEPSEEK_API_KEY}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理响应
deepseekAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('DeepSeek API Error:', error);
    return Promise.reject(error);
  }
);

export default deepseekAxios;
