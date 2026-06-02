'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Icon from './Icons';
import type { DoneData } from '@/lib/types';

export default function Report() {
  const [data, setData] = useState<DoneData | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePdf = () => window.print();

  const handleShare = async () => {
    const title = `복지봇 자가진단 리포트 - ${data?.selected_service?.serv_nm ?? '복지 서비스'}`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chatResult');
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  const selected = data?.selected_service;
  const hasHwpForms = data?.has_hwp_forms ?? false;
  const documentGuidance = data?.document_guidance ?? '';
  const applicationGuide = data?.application_guide ?? '';
  const finalReport = data?.final_report ?? '';

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
          <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleShare}>
              <Icon name="share" size={14} /> 공유
              {shareToast && (
                <span style={{ position: 'absolute', top: -32, right: 0, background: 'var(--text)', color: '#fff', fontSize: '0.78rem', padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                  링크 복사됨!
                </span>
              )}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handlePdf}>
              <Icon name="download" size={14} color="#fff" /> PDF 저장
            </button>
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

            {/* 서류 안내 */}
            {documentGuidance && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📋 필요 서류 안내</h3>
                <div style={{ padding: '18px 22px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {documentGuidance}
                </div>
              </div>
            )}

            {/* 신청 방법 안내 */}
            {applicationGuide && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>🗂️ 신청 방법</h3>
                <div style={{ padding: '18px 22px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {applicationGuide}
                </div>
              </div>
            )}

            {/* AI 최종 보고서 */}
            {finalReport && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>
                  <Icon name="sparkles" size={16} /> AI 신청 가이드
                </h3>
                <div style={{ padding: '20px 24px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text)' }}>
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

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleShare}><Icon name="share" size={16} /> 가족에게 공유</button>
          {hasHwpForms && (
            <Link href="/form" className="btn btn-secondary">
              <Icon name="download" size={16} /> 서류 작성하기
            </Link>
          )}
          <button className="btn btn-primary" onClick={handlePdf}><Icon name="download" size={16} color="#fff" /> PDF로 저장</button>
        </div>
      </div>
    </div>
  );
}
