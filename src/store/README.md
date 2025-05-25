# Redux Toolkit 集成文档

本项目已集成 Redux Toolkit 用于状态管理。

## 项目结构

```
src/store/
├── index.ts              # Store 配置
├── hooks.ts              # 类型安全的 Redux Hooks
├── Provider.tsx          # Redux Provider 组件
├── slices/              # Redux Slices
│   └── authSlice.ts     # 用户认证相关状态
├── thunks/              # 异步操作
│   └── authThunks.ts    # 认证相关异步操作
├── selectors/           # 选择器函数
│   └── authSelectors.ts # 认证状态选择器
└── README.md            # 说明文档
```

## 使用方法

### 1. 在组件中使用 Redux

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/thunks/authThunks';
import { selectUserInfo } from '../store/selectors/authSelectors';

function MyComponent() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // 登录成功
    } catch (error) {
      // 处理错误
    }
  };

  return (
    <div>
      {userInfo.isAuthenticated ? (
        <p>欢迎，{userInfo.user?.username}</p>
      ) : (
        <button onClick={() => handleLogin(credentials)}>登录</button>
      )}
    </div>
  );
}
```

### 2. 创建新的 Slice

```tsx
// src/store/slices/exampleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  data: string[];
  loading: boolean;
}

const initialState: ExampleState = {
  data: [],
  loading: false
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setData: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    }
  }
});

export const { setLoading, setData } = exampleSlice.actions;
export default exampleSlice.reducer;
```

### 3. 将新 Slice 添加到 Store

```tsx
// src/store/index.ts
import exampleSlice from './slices/exampleSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    example: exampleSlice // 添加新的 slice
  }
  // ...
});
```

### 4. 创建异步操作 (Thunks)

```tsx
// src/store/thunks/exampleThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk('example/fetchData', async (params: any, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.getData(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
```

### 5. 创建选择器

```tsx
// src/store/selectors/exampleSelectors.ts
import { RootState } from '../index';

export const selectExampleData = (state: RootState) => state.example.data;
export const selectExampleLoading = (state: RootState) => state.example.loading;
```

## 最佳实践

1. **使用类型安全的 Hooks**: 始终使用 `useAppDispatch` 和 `useAppSelector` 而不是原始的 React-Redux hooks
2. **组织文件结构**: 按功能将相关的 slices、thunks 和 selectors 分组
3. **使用选择器**: 创建可重用的选择器函数来封装状态访问逻辑
4. **异步操作**: 使用 `createAsyncThunk` 处理异步操作
5. **错误处理**: 在 thunks 中使用 `rejectWithValue` 处理错误

## 示例页面

访问 `/demo` 页面查看完整的 Redux Toolkit 使用示例。

## 当前功能

- ✅ 用户认证状态管理
- ✅ 登录/登出功能
- ✅ 错误状态处理
- ✅ 加载状态管理
- ✅ TypeScript 类型安全

## 测试账号

- 用户名: `admin`
- 密码: `123456`
