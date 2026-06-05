'use client';

import Link from 'next/link';
import Icon from './Icons';

function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 340" width="100%" height="100%" style={{ maxWidth: '94%' }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EBF2FF" />
          <stop offset="1" stopColor="#DCE7FA" />
        </linearGradient>
      </defs>
      <rect x="20" y="30" width="280" height="280" rx="22" fill="#fff" stroke="#E2E8F0" />
      <circle cx="45" cy="60" r="12" fill="#3B7DD8" />
      <rect x="63" y="53" width="90" height="8" rx="4" fill="#1A2B3C" />
      <rect x="63" y="65" width="60" height="6" rx="3" fill="#6B7C93" opacity="0.6" />
      <rect x="38" y="100" width="200" height="52" rx="16" fill="#EBF2FF" />
      <rect x="54" y="114" width="130" height="8" rx="4" fill="#3B7DD8" />
      <rect x="54" y="128" width="160" height="8" rx="4" fill="#6B93C8" opacity="0.7" />
      <rect x="110" y="170" width="170" height="44" rx="16" fill="#3B7DD8" />
      <rect x="126" y="184" width="100" height="8" rx="4" fill="#fff" opacity="0.95" />
      <rect x="126" y="196" width="60" height="8" rx="4" fill="#fff" opacity="0.7" />
      <rect x="38" y="236" width="66" height="30" rx="15" fill="#fff" stroke="#CBD5E1" />
      <rect x="50" y="248" width="42" height="6" rx="3" fill="#6B7C93" />
      <rect x="114" y="236" width="66" height="30" rx="15" fill="#fff" stroke="#CBD5E1" />
      <rect x="126" y="248" width="42" height="6" rx="3" fill="#6B7C93" />
      <g transform="translate(220, 56)">
        <rect width="180" height="220" rx="18" fill="#fff" stroke="#E2E8F0" />
        <rect x="16" y="18" width="80" height="8" rx="4" fill="#1A2B3C" />
        <rect x="16" y="34" width="100" height="6" rx="3" fill="#6B7C93" opacity="0.6" />
        <rect x="16" y="54" width="50" height="20" rx="10" fill="#E8F6E8" />
        <text x="26" y="68" fill="#2D7A2D" fontSize="9" fontWeight="700" fontFamily="system-ui">가능성 높음</text>
        <rect x="16" y="88" width="148" height="1" fill="#E2E8F0" />
        <rect x="16" y="104" width="110" height="8" rx="4" fill="#1A2B3C" />
        <rect x="16" y="120" width="80" height="6" rx="3" fill="#6B7C93" opacity="0.6" />
        <rect x="16" y="140" width="148" height="1" fill="#E2E8F0" />
        <rect x="16" y="156" width="110" height="8" rx="4" fill="#1A2B3C" />
        <rect x="16" y="172" width="80" height="6" rx="3" fill="#6B7C93" opacity="0.6" />
        <rect x="16" y="192" width="148" height="16" rx="8" fill="#3B7DD8" />
      </g>
      <circle cx="360" cy="30" r="5" fill="#5CB85C" opacity="0.5" />
      <circle cx="380" cy="300" r="7" fill="#F0AD4E" opacity="0.45" />
      <circle cx="20" cy="310" r="4" fill="#3B7DD8" opacity="0.3" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="screen">
      {/* HERO */}
      <section style={{ padding: '56px 0 40px', background: 'linear-gradient(180deg, #F3F7FE 0%, #F7F9FC 100%)' }}>
        <div className="container">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--border)', fontSize: '0.86rem', color: 'var(--text-sub)', fontWeight: 500, marginBottom: 20 }}>
                <Icon name="shield" size={14} color="var(--primary)" /> 모든 정보는 기기 안에서만 처리됩니다
              </div>
              <h1 style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 20px', fontWeight: 800 }}>
                받을 수 있는 복지,<br />
                <span style={{ color: 'var(--primary)' }}>놓치지 마세요</span>
              </h1>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-sub)', margin: '0 0 32px', maxWidth: 520, lineHeight: 1.6 }}>
                AI와의 대화 5분이면 충분해요.<br />
                나와 우리 가족이 받을 수 있는 복지 혜택을<br />찾아 신청서 초안까지 만들어드립니다.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/chat" className="btn btn-primary btn-lg">
                  지금 바로 시작하기 <Icon name="arrow" size={20} />
                </Link>
                <Link href="/about" className="btn btn-ghost btn-lg">
                  서비스 소개
                </Link>
              </div>
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-sub)', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', marginRight: -8 }}>
                  {['#FFE4B5', '#B5D4FF', '#C9E6C9'].map((c, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i > 0 ? -10 : 0 }} />
                  ))}
                </div>
                이미 <b style={{ color: 'var(--text)' }}>1,240명</b>이 자신의 혜택을 찾았어요
              </div>
            </div>
            <div className="placeholder-illust" style={{ aspectRatio: '5/4', borderRadius: 24, display: 'grid', placeItems: 'center', minHeight: 340 }}>
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { k: '460+', v: '복지서비스', s: '중앙·지자체 통합', icon: 'list' },
              { k: '142만명', v: '복지 사각지대', s: '혜택을 놓치고 있어요', icon: 'users' },
              { k: '평균 5분', v: '자가진단', s: '대화만으로 빠르게', icon: 'clock' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: 'left', padding: '28px 28px' }}>
                <div style={{ display: 'inline-grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: 14 }}>
                  <Icon name={s.icon} size={22} />
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>{s.k}</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{s.v}</div>
                <div style={{ color: 'var(--text-sub)', fontSize: '0.92rem', marginTop: 4 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '40px 0 80px', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>주요 기능</h2>
            <p style={{ color: 'var(--text-sub)', margin: 0, fontSize: '1.05rem' }}>복잡한 행정 절차 대신, 대화로 해결합니다</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: 'chat', title: '대화형 자가진단', desc: '어려운 행정용어 없이 AI가 쉬운 말로 하나씩 물어봐요. 답하기 어려운 항목은 건너뛸 수 있어요.', tag: 'STEP 1' },
              { icon: 'search', title: '수급 가능성 분석', desc: '답변을 바탕으로 460여 개 복지서비스 중 받을 가능성이 높은 혜택을 골라드려요.', tag: 'STEP 2' },
              { icon: 'doc', title: '신청서 초안 자동 작성', desc: '복지로 양식에 맞춰 신청서 초안을 작성합니다. 필요한 서류 목록도 함께 안내해드려요.', tag: 'STEP 3' },
            ].map((f, i) => (
              <div key={i} className="card card-hover" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'grid', placeItems: 'center', width: 52, height: 52, borderRadius: 14, background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Icon name={f.icon} size={26} strokeWidth={1.8} />
                  </div>
                  <span className="badge badge-gray" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-sub)', fontSize: '0.96rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="narrow">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="badge" style={{ marginBottom: 12 }}>
              <Icon name="sparkles" size={14} /> 이렇게 진행돼요
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)', margin: 0, letterSpacing: '-0.02em' }}>복잡한 신청, 대화로 한 번에</h2>
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
            {[
              { n: '01', t: '간단한 질문에 답해주세요', d: '나이, 가족 구성, 대략적인 소득 등. 민감한 정보는 모두 기기 안에서만 처리됩니다.' },
              { n: '02', t: 'AI가 460여 개 복지서비스를 분석해요', d: '국민기초생활보장, 기초연금, 주거급여, 장애인 연금 등 대상 가능성을 점수로 알려드려요.' },
              { n: '03', t: '필요 서류 체크리스트를 받아보세요', d: '어디에서 발급받는지, 온라인 가능 여부까지. 종이 없이도 준비할 수 있어요.' },
              { n: '04', t: '신청서 초안을 확인하고 제출하세요', d: '복지로 양식에 맞춘 초안을 PDF로 저장하거나, 바로 복지로로 연결해드립니다.' },
            ].map((s, i) => (
              <li key={i} className="card" style={{ display: 'flex', gap: 20, padding: '22px 24px', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', minWidth: 44, paddingTop: 2 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: 4 }}>{s.t}</div>
                  <div style={{ color: 'var(--text-sub)', fontSize: '0.96rem' }}>{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/chat" className="btn btn-primary btn-lg">
              무료로 진단 받기 <Icon name="arrow" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span className="brand-mark" style={{ width: 28, height: 28, fontSize: '0.8rem' }}>복</span>
            <b style={{ color: 'var(--text)' }}>복지봇</b>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>· 복지 사각지대 해소 AI 서비스</span>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <a>이용약관</a>
            <a>개인정보처리방침</a>
            <a>문의하기</a>
            <a>접근성 안내</a>
          </div>
          <div className="footer-disclaimer">
            <Icon name="info" size={16} color="var(--primary)" style={{ marginRight: 6, verticalAlign: 'middle' }} />
            본 서비스는 <b>AI 사전 진단 서비스</b>로, 최종 수급 확정은 행정기관의 심사를 거칩니다. 안내는 참고용이며, 정확한 신청은{' '}
            <a style={{ color: 'var(--primary)', textDecoration: 'underline' }} href="https://bokjiro.go.kr" target="_blank" rel="noopener noreferrer">
              복지로(bokjiro.go.kr)
            </a>{' '}
            또는 읍·면·동 주민센터를 통해 진행하세요.
          </div>
        </div>
      </footer>
    </div>
  );
}
