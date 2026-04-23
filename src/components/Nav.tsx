'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export default function Nav() {
  const pathname = usePathname();
  const { large, setLarge } = useApp();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">복</span>
          <span>복지봇</span>
        </Link>
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>홈</Link>
          <Link href="/chat" className={`nav-link ${pathname === '/chat' ? 'active' : ''}`}>진단 시작</Link>
          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>서비스 소개</Link>
          <button
            className="large-toggle"
            aria-pressed={large}
            onClick={() => setLarge((v) => !v)}
            title="글씨 크게 보기"
          >
            <span className="ic">T</span>
            <span>{large ? '기본 글씨' : '큰 글씨'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
