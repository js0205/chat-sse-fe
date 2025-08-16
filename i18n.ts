import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

// 确保i18n只初始化一次
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next) // 将 i18next 传递给 react-i18next
    .init({
      resources: {
        en: {
          translation: translationEN
        },
        zh: {
          translation: translationZH
        }
      },
      lng: 'en', // 默认语言
      fallbackLng: 'en', // 如果当前语言没有翻译，则使用默认语言
      interpolation: {
        escapeValue: false // React 已经处理了 XSS
      },
      react: {
        useSuspense: false // 禁用Suspense以避免SSR问题
      }
    });
}

export default i18n;
