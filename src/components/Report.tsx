'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Icon from './Icons';
import type { DoneData } from '@/lib/types';

export default function Report() {
  const [data, setData] = useState<DoneData | null>(null);
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chatResult');
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  const candidates = data?.welfare_candidates ?? [];
  const finalReport = data?.final_report ?? '';
  const selected = data?.selected_service;

  if (!data) {
    return (
      <div className="screen" style={{ padding: '32px 0 80px', textAlign: 'center' }}>
        <div className="narrow">
          <p style={{ color: 'var(--text-sub)', marginBottom: 20 }}>진단 결과가 없어요. 먼저 복지 진단을 진행해주세요.</p>
          <Link href="/chat" className="btn btn-primary">복지 진단 시작하기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ padding: '32px 0 80px' }}>
      <div className="narrow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <Link href="/chat" className="btn btn-ghost btn-sm">← 진단 다시하기</Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="share" size={14} /> 공유</button>
            <button className="btn btn-primary btn-sm"><Icon name="download" size={14} color="#fff" /> PDF 저장</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          {/* 헤더 */}
          <div style={{ padding: '28px 36px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="brand-mark" style={{ width: 32, height: 32 }}>복</span>
                <b style={{ fontSize: '1.05rem' }}>복지봇 자가진단 리포트</b>
              </div>
              <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>생성일시: {today}</div>
            </div>
          </div>

          <div style={{ padding: '32px 36px' }}>
            {/* 선택 서비스 */}
            {selected && (
              <div style={{ marginBottom: 28, padding: '18px 22px', background: 'var(--primary-light, #EBF2FF)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>선택하신 서비스</div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{selected.serv_nm}</div>
                <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: 2 }}>{selected.department}</div>
              </div>
            )}

            {/* 통계 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
              <div style={{ background: 'var(--secondary-light)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {candidates.length}
                </div>
                <div style={{ marginTop: 6, fontWeight: 600, color: 'var(--secondary)' }}>매칭된 서비스</div>
              </div>
              <div style={{ background: 'var(--primary-light, #EBF2FF)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {candidates.filter(c => c.score >= 0.6).length}
                </div>
                <div style={{ marginTop: 6, fontWeight: 600, color: 'var(--primary)' }}>가능성 높음</div>
              </div>
            </div>

            {/* AI 리포트 — 마크다운 렌더링 */}
            {finalReport && (
              <>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📋 AI 분석 리포트</h3>
                <div style={{
                  padding: '20px 24px',
                  background: 'var(--surface)',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  color: 'var(--text)',
                  marginBottom: 28,
                }}>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '16px 0 8px', letterSpacing: '-0.01em' }}>{children}</h1>,
                      h2: ({ children }) => <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '14px 0 6px' }}>{children}</h2>,
                      h3: ({ children }) => <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '12px 0 4px' }}>{children}</h3>,
                      p: ({ children }) => <p style={{ margin: '6px 0' }}>{children}</p>,
                      ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: '6px 0' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ paddingLeft: 20, margin: '6px 0' }}>{children}</ol>,
                      li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ fontWeight: 700, color: 'var(--text)' }}>{children}</strong>,
                      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{children}</a>,
                    }}
                  >
                    {finalReport}
                  </ReactMarkdown>
                </div>
              </>
            )}

            {/* 매칭 서비스 목록 */}
            <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>✅ 매칭된 복지 서비스</h3>
            <div style={{ display: 'grid', gap: 8, marginBottom: 28 }}>
              {candidates.map((c) => (
                <div key={c.serv_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 10, gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.serv_nm}</div>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem', marginTop: 2 }}>{c.department}</div>
                  </div>
                  {c.score >= 0.6
                    ? <span className="badge badge-green"><span className="badge-dot" />가능성 높음</span>
                    : <span className="badge badge-yellow"><span className="badge-dot" />추가 확인 필요</span>
                  }
                </div>
              ))}
            </div>

            {/* 다른 서비스 보기 */}
            {candidates.length > 1 && (
              <div style={{ marginBottom: 28, textAlign: 'center' }}>
                <Link href="/results" className="btn btn-ghost btn-sm">
                  다른 서비스도 보기 ({candidates.length - 1}개 더)
                </Link>
              </div>
            )}

            <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📌 다음 단계 할 일</h3>
            <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--text)', lineHeight: 1.8 }}>
              <li>가까운 주민센터 또는 <a style={{ color: 'var(--primary)' }} href="https://bokjiro.go.kr" target="_blank" rel="noopener noreferrer">복지로</a>에서 신청 접수</li>
              <li>신분증, 통장 사본, 가족관계증명서 등 기본 서류 준비</li>
              <li>심사 결과는 신청 후 30일 이내 통보 (연장 가능)</li>
            </ol>

            <div className="footer-disclaimer" style={{ marginTop: 28 }}>
              <b>⚠️ 안내</b> 본 리포트는 AI 사전 진단 결과로, 최종 수급 확정은 행정기관의 심사를 거칩니다. 실제 지급액은 개인 상황에 따라 다를 수 있습니다.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
          <button className="btn btn-secondary"><Icon name="share" size={16} /> 가족에게 공유</button>
          <button className="btn btn-primary"><Icon name="download" size={16} color="#fff" /> PDF로 저장</button>
        </div>
      </div>
    </div>
  );
}
