import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: '복지봇 — 받을 수 있는 복지, 놓치지 마세요',
  description: 'AI와의 대화 5분이면 충분해요. 나와 우리 가족이 받을 수 있는 복지 혜택을 찾아 신청서 초안까지 만들어드립니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProvider>
          <Nav />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
