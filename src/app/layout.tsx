import ReduxProvider from '@/store/Provider';
import './globals.css';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
};

export default Layout;
