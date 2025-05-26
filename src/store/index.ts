// 导入Redux Toolkit的核心函数configureStore，用于创建Redux store
import { configureStore } from '@reduxjs/toolkit';
// 导入认证相关的slice reducer
import authSlice from './slices/authSlice';

// 创建并配置Redux store
export const store = configureStore({
  // 配置根reducer，将各个slice组合起来
  reducer: {
    // 认证状态管理
    auth: authSlice
  },
  // 配置中间件
  middleware: (getDefaultMiddleware) =>
    // 获取默认中间件并进行自定义配置
    getDefaultMiddleware({
      // 配置序列化检查
      serializableCheck: {
        // 忽略这些action的序列化检查（通常用于redux-persist）
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // 忽略这些字段的序列化检查
        ignoredPaths: ['auth.tokenExpiresAt']
      },
      // 开启不可变性检查（开发环境）
      immutableCheck: {
        // 设置警告阈值，超过128ms的操作会发出警告
        warnAfter: 128
      }
    }),
  // 开发工具配置，只在非生产环境启用Redux DevTools
  devTools: process.env.NODE_ENV !== 'production'
});

// 导出RootState类型，用于TypeScript类型推断
// 这个类型代表整个应用的状态结构
export type RootState = ReturnType<typeof store.getState>;
// 导出AppDispatch类型，用于TypeScript类型推断
// 这个类型包含了所有可能的dispatch操作
export type AppDispatch = typeof store.dispatch;

// 导出store实例，用于在组件外部使用（如中间件、工具函数等）
export default store;
