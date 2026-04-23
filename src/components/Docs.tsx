'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import type { WelfareService } from '@/lib/types';

const docItems = [
  { name: '신분증', formal: '주민등록증·운전면허증', where: '본인 소지', online: false, detail: '현재 소지하고 있는 신분증을 준비하세요.' },
  { name: '통장 사본', formal: '본인 명의 예금통장 사본', where: '은행 앱 또는 지점', online: true, detail: '대부분의 은행 앱에서 통장사본 PDF로 발급받을 수 있습니다.' },
  { name: '소득·재산 증빙', formal: '소득재산신고서', where: '정부24', online: true, detail: '정부24(gov.kr)에서 본인 인증 후 발급 가능. 주민센터에서도 발급됩니다.' },
  { name: '가족관계증명서', formal: '상세증명서 (발급일 3개월 이내)', where: '정부24 또는 주민센터', online: true, detail: '정부24에서 무료 발급 가능합니다.' },
];

export default function Docs() {
  const [selected, setSelected] = useState<WelfareService | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [open, setOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('selectedService');
      if (raw) setSelected(JSON.parse(raw));
    } catch {}
  }, []);

  const s = selected || { name: '기초연금', dept: '보건복지부' };

  return (
    <div className="screen" style={{ padding: '32px 0 80px' }}>
      <div className="narrow">
        <Link href="/results" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← 결과 목록으로
        </Link>

        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 6 }}>
            <Icon name="building" size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{s.dept}
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{s.name} 신청 서류</h1>
          <p style={{ color: 'var(--text-sub)', margin: '10px 0 0' }}>
            아래 서류를 준비해주세요. 온라인으로 발급 가능한 서류는 <b style={{ color: 'var(--primary)' }}>집에서도</b> 받을 수 있어요.
          </p>
        </div>

        <h3 style={{ fontSize: '1.1rem', margin: '24px 0 12px' }}>📋 필요 서류 체크리스트</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {docItems.map((d, i) => (
            <div key={i} className={`check-row ${checked[i] ? 'checked' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
              <div style={{ display: 'flex', gap: 14, padding: '16px 18px' }}>
                <button
                  className="checkbox"
                  onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                  aria-pressed={!!checked[i]}
                  aria-label={`${d.name} 준비 완료`}
                  style={{ background: checked[i] ? 'var(--secondary)' : 'transparent', border: checked[i] ? '2px solid var(--secondary)' : '2px solid var(--border-strong)' }}
                >
                  {checked[i] && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{d.name}</div>
                      <div style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: 2 }}>{d.formal}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {d.online
                        ? <span className="badge badge-green"><Icon name="check" size={12} /> 온라인 발급 가능</span>
                        : <span className="badge badge-gray">🏛️ 방문 필요</span>
                      }
                      <button
                        className="btn-ghost"
                        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.85rem', cursor: 'pointer' }}
                        onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                      >
                        어디서 발급? <Icon name={open[i] ? 'chevDown' : 'chevRight'} size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {open[i] && (
                <div style={{ padding: '12px 18px 18px 56px', color: 'var(--text-sub)', fontSize: '0.95rem', borderTop: '1px solid var(--border)' }}>
                  {d.detail}
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.1rem', margin: '32px 0 12px' }}>🏢 담당 기관 안내</h3>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>행복동 주민센터</div>
          <div style={{ color: 'var(--text-sub)', fontSize: '0.95rem', marginBottom: 12 }}>서울특별시 OO구 행복로 123</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm"><Icon name="phone" size={14} /> 02-000-1234</button>
            <button className="btn btn-ghost btn-sm"><Icon name="map" size={14} /> 지도에서 보기</button>
          </div>
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
