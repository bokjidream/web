'use client';

import Link from 'next/link';
import Icon from './Icons';
import { RESULTS_DATA } from '@/lib/data';

export default function Report() {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="screen" style={{ padding: '32px 0 80px' }}>
      <div className="narrow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <Link href="/results" className="btn btn-ghost btn-sm">← 결과로 돌아가기</Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="share" size={14} /> 공유</button>
            <button className="btn btn-primary btn-sm"><Icon name="download" size={14} color="#fff" /> PDF 저장</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '28px 36px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="brand-mark" style={{ width: 32, height: 32 }}>복</span>
                <b style={{ fontSize: '1.05rem' }}>복지봇 자가진단 리포트</b>
              </div>
              <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>생성일시: {today}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              리포트 번호<br />
              <span className="mono" style={{ color: 'var(--text)' }}>BK-2026-04-0001</span>
            </div>
          </div>

          <div style={{ padding: '32px 36px' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 6 }}>수급자</div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', letterSpacing: '-0.02em' }}>김복지 님의 복지서비스 자가진단 결과</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
              {[
                { k: RESULTS_DATA.eligible.length, l: '즉시 신청 가능', c: 'var(--secondary)', bg: 'var(--secondary-light)' },
                { k: RESULTS_DATA.needsCheck.length, l: '추가 확인 필요', c: 'var(--warning)', bg: 'var(--warning-light)' },
                { k: RESULTS_DATA.notEligible.length, l: '해당 가능성 낮음', c: 'var(--danger)', bg: 'var(--danger-light)' },
              ].map((x, i) => (
                <div key={i} style={{ background: x.bg, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: x.c, letterSpacing: '-0.02em', lineHeight: 1 }}>{x.k}</div>
                  <div style={{ marginTop: 6, fontWeight: 600, color: x.c }}>{x.l}</div>
                </div>
              ))}
            </div>

            <h3 style={{ margin: '32px 0 12px', fontSize: '1.05rem' }}>✅ 즉시 신청 가능</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {RESULTS_DATA.eligible.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 10, gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem' }}>{s.dept} · {s.amount}</div>
                  </div>
                  <span className="badge badge-green"><span className="badge-dot" />가능성 높음</span>
                </div>
              ))}
            </div>

            <h3 style={{ margin: '24px 0 12px', fontSize: '1.05rem' }}>🟡 추가 확인 필요</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {RESULTS_DATA.needsCheck.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ color: 'var(--text-sub)', fontSize: '0.88rem' }}>{s.dept} · {s.amount}</div>
                  </div>
                  <span className="badge badge-yellow"><span className="badge-dot" />확인 필요</span>
                </div>
              ))}
            </div>

            <h3 style={{ margin: '28px 0 12px', fontSize: '1.05rem' }}>📌 다음 단계 할 일</h3>
            <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--text)', lineHeight: 1.8 }}>
              <li>가까운 주민센터 또는 <a style={{ color: 'var(--primary)' }} href="https://bokjiro.go.kr" target="_blank" rel="noopener noreferrer">복지로</a>에서 신청 접수</li>
              <li>신분증, 통장 사본, 가족관계증명서 등 기본 서류 준비</li>
              <li>기초연금은 만 65세 생일이 속한 달 1일부터 신청 가능</li>
              <li>심사 결과는 신청 후 30일 이내 통보 (연장 가능)</li>
            </ol>

            <div className="footer-disclaimer" style={{ marginTop: 28 }}>
              <b>⚠️ 안내</b> 본 리포트는 AI 사전 진단 결과로, 최종 수급 확정은 행정기관의 심사를 거칩니다. 안내 금액과 조건은 2026년 기준이며, 실제 지급액은 개인 상황에 따라 다를 수 있습니다.
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
