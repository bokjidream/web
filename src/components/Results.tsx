'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from './Icons';
import { RESULTS_DATA } from '@/lib/data';
import type { WelfareService } from '@/lib/types';

type Tab = 'eligible' | 'needsCheck' | 'notEligible';

function LevelBadge({ level }: { level: WelfareService['level'] }) {
  if (level === 'high') return <span className="badge badge-green"><span className="badge-dot" />가능성 높음</span>;
  if (level === 'mid') return <span className="badge badge-yellow"><span className="badge-dot" />추가 확인 필요</span>;
  return <span className="badge badge-red"><span className="badge-dot" />해당 가능성 낮음</span>;
}

export default function Results() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('eligible');
  const data = RESULTS_DATA[tab];
  const total = RESULTS_DATA.eligible.length + RESULTS_DATA.needsCheck.length;

  const goToService = (path: string, service: WelfareService) => {
    try { sessionStorage.setItem('selectedService', JSON.stringify(service)); } catch {}
    router.push(path);
  };

  return (
    <div className="screen" style={{ padding: '32px 0 100px' }}>
      <div className="narrow">
        <Link href="/chat" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← 진단 다시하기
        </Link>

        <div className="card" style={{ padding: 28, marginBottom: 20, background: 'linear-gradient(135deg, #EBF2FF 0%, #F3F7FE 100%)', border: '1px solid #D6E3F8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 10 }}>
            <Icon name="sparkles" size={16} /> 진단 결과
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            김복지 님이 받을 수 있는<br />복지서비스 <span style={{ color: 'var(--primary)' }}>{total}개</span>를 찾았어요
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--text-sub)' }}>
            총 460여 개 서비스 중 답변 내용과 일치도가 높은 서비스를 골라드렸어요.
          </p>
        </div>

        <div className="tabs" style={{ marginBottom: 16 }}>
          <button className={`tab ${tab === 'eligible' ? 'active' : ''}`} onClick={() => setTab('eligible')}>
            <span className="badge-dot" style={{ background: '#5CB85C' }} />
            즉시 신청 가능 <b>({RESULTS_DATA.eligible.length})</b>
          </button>
          <button className={`tab ${tab === 'needsCheck' ? 'active' : ''}`} onClick={() => setTab('needsCheck')}>
            <span className="badge-dot" style={{ background: '#F0AD4E' }} />
            추가 확인 필요 <b>({RESULTS_DATA.needsCheck.length})</b>
          </button>
          <button className={`tab ${tab === 'notEligible' ? 'active' : ''}`} onClick={() => setTab('notEligible')}>
            <span className="badge-dot" style={{ background: '#D9534F' }} />
            해당 없음 <b>({RESULTS_DATA.notEligible.length})</b>
          </button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {data.map((s, i) => (
            <div key={i} className="result-card">
              <div className="rc-top">
                <div>
                  <div className="rc-title">{s.name}</div>
                  <div className="rc-dept">
                    <span className="badge badge-gray" style={{ marginRight: 6 }}>
                      <Icon name="building" size={12} /> {s.dept}
                    </span>
                  </div>
                </div>
                <LevelBadge level={s.level} />
              </div>
              {s.amount && <div className="rc-amount">💰 {s.amount}</div>}
              <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>{s.summary}</div>
              {tab !== 'notEligible' && (
                <div className="rc-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => goToService('/docs', s)}>
                    서류 안내 보기
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => goToService('/form', s)}>
                    신청서 초안 작성 <Icon name="arrow" size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ position: 'sticky', bottom: 16, marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <Link href="/report" className="btn btn-primary btn-lg" style={{ boxShadow: '0 10px 28px rgba(59, 125, 216, 0.3)' }}>
            <Icon name="download" size={18} color="#fff" /> 전체 결과 리포트 저장
          </Link>
        </div>
      </div>
    </div>
  );
}
