'use client';

import Link from 'next/link';
import Icon from './Icons';

export default function About() {
  return (
    <div className="screen" style={{ padding: '48px 0 80px' }}>
      <div className="narrow">
        <div className="badge" style={{ marginBottom: 16 }}>
          <Icon name="heart" size={14} /> 복지 사각지대 해소 프로젝트
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          받을 수 있는 복지를 <br />놓치는 분이 없도록
        </h1>
        <p style={{ color: 'var(--text-sub)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
          우리나라에는 460여 개의 복지서비스가 있지만, 매년 <b style={{ color: 'var(--text)' }}>142만 명</b>이 받을 수 있는 혜택을 놓칩니다.
          복잡한 행정 용어, 너무 많은 서비스, 어디부터 알아봐야 할지 막막한 절차. 복지봇은 대화만으로 이 장벽을 넘어서도록 돕습니다.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 36 }}>
          {[
            { ic: 'shield', t: '개인정보 로컬 처리', d: '입력하신 모든 정보는 여러분의 기기 안에서만 처리되고, 외부 서버로 전송되지 않습니다.' },
            { ic: 'bulb', t: '쉬운 말, 친근한 대화', d: '어려운 행정용어 대신 일상의 말로 물어보고, 모르는 용어는 툴팁으로 바로 설명해드려요.' },
            { ic: 'users', t: '가족·보호자 공유', d: '진단 결과를 보호자에게 공유해 함께 신청을 도울 수 있어요.' },
            { ic: 'heart', t: '접근성 최우선', d: '큰 글씨 모드, 음성 입력, 높은 색상 대비. WCAG AA 이상을 준수합니다.' },
          ].map((x, i) => (
            <div key={i} className="card">
              <div style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: 12 }}>
                <Icon name={x.ic} size={22} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{x.t}</div>
              <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>{x.d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/chat" className="btn btn-primary btn-lg">
            지금 바로 진단 시작 <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
