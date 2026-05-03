'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import type { DoneData, WelfareCandidate } from '@/lib/types';

export default function Docs() {
  const [candidate, setCandidate] = useState<WelfareCandidate | null>(null);
  const [guidance, setGuidance] = useState<string>('');
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('selectedService');
      if (raw) setCandidate(JSON.parse(raw));

      const resultRaw = sessionStorage.getItem('chatResult');
      if (resultRaw) {
        const result: DoneData = JSON.parse(resultRaw);
        setGuidance(result.document_guidance ?? '');
        // selectedService가 없으면 chatResult의 selected_service 사용
        if (!raw && result.selected_service) {
          setCandidate(result.selected_service);
        }
      }
    } catch {}
  }, []);

  const docs = candidate?.required_documents ?? [];
  const name = candidate?.serv_nm ?? '복지 서비스';
  const dept = candidate?.department ?? '';

  return (
    <div className="screen" style={{ padding: '32px 0 80px' }}>
      <div className="narrow">
        <Link href="/results" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← 결과 목록으로
        </Link>

        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 6 }}>
            <Icon name="building" size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{dept}
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{name} 신청 서류</h1>
          <p style={{ color: 'var(--text-sub)', margin: '10px 0 0' }}>
            아래 서류를 준비해주세요. 체크하면서 준비 현황을 확인할 수 있어요.
          </p>
        </div>

        {guidance && (
          <div className="banner info" style={{ marginBottom: 20 }}>
            <Icon name="sparkles" size={18} />
            <div style={{ whiteSpace: 'pre-line' }}>{guidance}</div>
          </div>
        )}

        <h3 style={{ fontSize: '1.1rem', margin: '24px 0 12px' }}>📋 필요 서류 체크리스트</h3>

        {docs.length > 0 ? (
          <div style={{ display: 'grid', gap: 10 }}>
            {docs.map((doc, i) => (
              <div key={i} className={`check-row ${checked[i] ? 'checked' : ''}`} style={{ padding: '16px 18px' }}>
                <button
                  className="checkbox"
                  onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                  aria-pressed={!!checked[i]}
                  aria-label={`${doc} 준비 완료`}
                  style={{
                    background: checked[i] ? 'var(--secondary)' : 'transparent',
                    border: checked[i] ? '2px solid var(--secondary)' : '2px solid var(--border-strong)',
                  }}
                >
                  {checked[i] && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{doc}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 24, color: 'var(--text-sub)', textAlign: 'center' }}>
            서류 정보를 불러오는 중이에요. 주민센터 또는 복지로에서 확인해주세요.
          </div>
        )}

        <h3 style={{ fontSize: '1.1rem', margin: '32px 0 12px' }}>🔗 신청 방법</h3>
        <div className="card" style={{ padding: 22 }}>
          {candidate?.application_url ? (
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>온라인 신청 가능</div>
              <a
                href={candidate.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                온라인 신청하기 <Icon name="external" size={14} color="#fff" />
              </a>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>가까운 주민센터 방문</div>
              <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
                거주지 관할 주민센터 또는 복지로(bokjiro.go.kr)에서 신청하세요.
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <Link href="/form" className="btn btn-primary btn-lg">
            <Icon name="doc" size={18} color="#fff" /> 신청서 초안 작성하기
          </Link>
        </div>
      </div>
    </div>
  );
}
