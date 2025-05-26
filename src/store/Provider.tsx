// 标记为客户端组件，因为Redux需要在客户端运行
'use client';

// 导入React Redux的Provider组件
import { Provider } from 'react-redux';
import store from './index';

// 定义Provider组件的props类型
interface ReduxProviderProps {
  // children属性，用于包装子组件
  children: React.ReactNode;
}

// 导出Redux Provider包装组件
// 这个组件将Redux store提供给整个应用的组件树
export default function ReduxProvider({ children }: ReduxProviderProps) {
  // 返回Provider组件，将store传递给所有子组件
  // 这样所有被包装的组件都可以访问Redux store
  return <Provider store={store}>{children}</Provider>;
}
