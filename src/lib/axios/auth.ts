import axios from 'axios';

// 认证服务 API 专用实例
const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_YOULAI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 可以添加token等认证信息
authAxios.interceptors.request.use(
  (config) => {
    // 如果有存储的token，可以在这里添加
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理认证响应
authAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Auth API Error:', error);

    // 处理认证失败的情况
    if (error.response?.status === 401) {
      // 清除过期token，重定向到登录页等
      localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default authAxios;
