'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from './Icons';
import type { DoneData, WelfareCandidate } from '@/lib/types';

function ScoreBadge({ score }: { score: number }) {
  if (score >= 0.6) return <span className="badge badge-green"><span className="badge-dot" />가능성 높음</span>;
  if (score >= 0.3) return <span className="badge badge-yellow"><span className="badge-dot" />추가 확인 필요</span>;
  return <span className="badge badge-red"><span className="badge-dot" />해당 가능성 낮음</span>;
}

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState<DoneData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chatResult');
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  const candidates = data?.welfare_candidates ?? [];

  const goToService = (path: string, candidate: WelfareCandidate) => {
    try { sessionStorage.setItem('selectedService', JSON.stringify(candidate)); } catch {}
    router.push(path);
  };

  if (!data) {
    return (
      <div className="screen" style={{ padding: '32px 0 100px', textAlign: 'center' }}>
        <div className="narrow">
          <p style={{ color: 'var(--text-sub)', marginBottom: 20 }}>진단 결과가 없어요. 먼저 복지 진단을 진행해주세요.</p>
          <Link href="/chat" className="btn btn-primary">복지 진단 시작하기</Link>
        </div>
      </div>
    );
  }

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
            받을 수 있는 복지서비스<br /><span style={{ color: 'var(--primary)' }}>{candidates.length}개</span>를 찾았어요
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--text-sub)' }}>
            입력하신 정보를 바탕으로 맞춤 복지 서비스를 찾아드렸어요.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {candidates.map((c) => (
            <div key={c.serv_id} className="result-card">
              <div className="rc-top">
                <div>
                  <div className="rc-title">{c.serv_nm}</div>
                  <div className="rc-dept">
                    <span className="badge badge-gray" style={{ marginRight: 6 }}>
                      <Icon name="building" size={12} /> {c.department}
                    </span>
                  </div>
                </div>
                <ScoreBadge score={c.score} />
              </div>
              <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
                {c.serv_dgst.length > 120 ? c.serv_dgst.slice(0, 120) + '...' : c.serv_dgst}
              </div>
              {c.eligibility_reason && (
                <div style={{ marginTop: 6, fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 500 }}>
                  → {c.eligibility_reason}
                </div>
              )}
              <div className="rc-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => goToService('/docs', c)}>
                  서류 안내 보기
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => goToService('/form', c)}>
                  신청서 초안 작성 <Icon name="arrow" size={14} />
                </button>
              </div>
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
