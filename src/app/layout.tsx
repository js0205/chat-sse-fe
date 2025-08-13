import { WebVitalsReporter } from '@/components/WebVitalsReporter';
import ReduxProvider from '@/store/Provider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body>
        <ReduxProvider>
          {children}
          {/* Web Vitals 指标收集组件 */}
          <WebVitalsReporter />
          {/* Vercel Speed Insights 性能监控 */}
          <SpeedInsights />
        </ReduxProvider>
      </body>
    </html>
  );
};

export default Layout;
