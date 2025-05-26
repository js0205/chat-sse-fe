// 导入React Redux的类型化hooks和基础hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// 导入我们自定义的类型定义
import type { AppDispatch, RootState } from './index';

// 创建类型安全的dispatch hook
// 这个hook确保dispatch操作具有正确的类型推断
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 创建类型安全的selector hook
// 这个hook确保从state中选择数据时具有正确的类型推断
// TypedUseSelectorHook<RootState>确保state参数的类型为RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
