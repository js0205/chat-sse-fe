import { WebVitalsReporter } from '@/components/WebVitalsReporter';
import ReduxProvider from '@/store/Provider';
import './globals.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body>
        <ReduxProvider>
          {children}
          {/* Web Vitals 指标收集组件 */}
          <WebVitalsReporter />
        </ReduxProvider>
      </body>
    </html>
  );
};

export default Layout;
