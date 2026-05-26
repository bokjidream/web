'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import type { DoneData, FilledForm, WelfareCandidate } from '@/lib/types';

interface Fields {
  name: string;
  birth: string;
  phone: string;
  address: string;
  bank: string;
  income: string;
  family: string;
  reason: string;
}

const FILE_TYPE_LABEL: Record<string, string> = {
  hwp: 'HWP',
  hwpx: 'HWPX',
};

const FILE_TYPE_COLOR: Record<string, string> = {
  hwp: '#3182CE',
  hwpx: '#3182CE',
};

export default function Form() {
  const [candidate, setCandidate] = useState<WelfareCandidate | null>(null);
  const [applicationGuide, setApplicationGuide] = useState<string>('');
  const [filledForms, setFilledForms] = useState<FilledForm[]>([]);
  const [fields, setFields] = useState<Fields>({
    name: '',
    birth: '',
    phone: '',
    address: '',
    bank: '',
    income: '',
    family: '',
    reason: '',
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('selectedService');
      if (raw) setCandidate(JSON.parse(raw));

      const resultRaw = sessionStorage.getItem('chatResult');
      if (resultRaw) {
        const result: DoneData = JSON.parse(resultRaw);
        setApplicationGuide(result.application_guide ?? '');
        setFilledForms(result.filled_forms ?? []);
        if (!raw && result.selected_service) {
          setCandidate(result.selected_service);
        }
      }
    } catch {}
  }, []);

  const successForms = filledForms.filter((f) => f.status === 'success');

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const name = candidate?.serv_nm ?? '복지 서비스';
  const dept = candidate?.department ?? '';

  const FieldRow = ({
    id, label, manual, placeholder, hint, multi,
  }: {
    id: keyof Fields;
    label: string;
    manual?: boolean;
    placeholder?: string;
    hint?: string;
    multi?: boolean;
  }) => (
    <div className={`field ${manual ? 'manual' : ''}`}>
      <label htmlFor={id}>
        {label}
        {manual
          ? <span className="field-note">✏️ 직접 입력 필요</span>
          : <span className="field-note"><Icon name="sparkles" size={12} color="var(--primary)" /> AI 자동입력</span>
        }
      </label>
      {multi
        ? <textarea id={id} rows={3} value={fields[id]} onChange={set(id)} placeholder={placeholder} />
        : <input id={id} value={fields[id]} onChange={set(id)} placeholder={placeholder} />
      }
      {hint && <div className="field-note" style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  );

  return (
    <div className="screen" style={{ padding: '32px 0 80px' }}>
      <div className="narrow">
        <Link href="/report" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← 리포트로
        </Link>

        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>{dept} · 신청서 초안</div>
          <h1 style={{ margin: '4px 0 0', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{name} 신청서 초안</h1>
        </div>

        {applicationGuide ? (
          <div className="banner info">
            <Icon name="sparkles" size={18} />
            <div style={{ whiteSpace: 'pre-line' }}>{applicationGuide}</div>
          </div>
        ) : (
          <div className="banner info">
            <Icon name="sparkles" size={18} />
            <div>
              <b>인터뷰 내용을 바탕으로 신청서 초안을 작성했어요.</b><br />
              직접 입력이 필요한 항목은 <span style={{ color: '#B87B24', fontWeight: 600 }}>노란색</span>으로 표시돼요.
            </div>
          </div>
        )}

        {/* AI 자동 작성 완료 신청서 — 핵심 가치 */}
        {successForms.length > 0 && (
          <div
            style={{
              marginTop: 20,
              padding: '22px 24px',
              background: 'linear-gradient(135deg, rgba(83, 122, 255, 0.08), rgba(83, 122, 255, 0.03))',
              border: '1.5px solid var(--primary)',
              borderRadius: 14,
              boxShadow: '0 4px 14px rgba(83, 122, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Icon name="sparkles" size={18} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>
                AI가 작성한 신청서 초안
              </h3>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'var(--primary)',
                  color: '#fff',
                }}
              >
                NEW
              </span>
            </div>
            <p style={{ margin: '4px 0 14px', fontSize: '0.88rem', color: 'var(--text-sub)' }}>
              인터뷰에서 수집한 정보를 바탕으로 신청서를 자동으로 채워드렸어요. 다운로드 후 내용을 확인하고 부족한 부분만 수정하세요.
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {successForms.map((form, i) => {
                const fileName = form.download_key.split('/').pop() ?? `form_${i}.${form.file_type}`;
                const href = `/api/forms/download/${form.download_key}`;
                const typeLabel = FILE_TYPE_LABEL[form.file_type] ?? form.file_type.toUpperCase();
                const typeColor = FILE_TYPE_COLOR[form.file_type] ?? '#718096';
                return (
                  <a
                    key={form.download_key}
                    href={href}
                    download={fileName}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 18px',
                      borderRadius: 10,
                      background: '#fff',
                      border: '1px solid var(--border)',
                      textDecoration: 'none',
                      color: 'var(--text)',
                      transition: 'border-color .15s, box-shadow .15s, transform .1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = 'var(--shadow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: typeColor + '18',
                        color: typeColor,
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        flexShrink: 0,
                      }}
                    >
                      {typeLabel}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: '0.98rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {form.original_title}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: 2 }}>
                        ✨ AI 자동입력 완료 · 다운로드해서 검토하세요
                      </span>
                    </span>
                    <Icon name="download" size={18} color="var(--primary)" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {candidate?.application_method && (
          <div className="card" style={{ padding: 22, marginTop: 20 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.05rem' }}>📋 신청 방법</h3>
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.8 }}>
              {candidate.application_method}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: 28, marginTop: 20 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '1.1rem' }}>👤 기본 정보</h3>
          <FieldRow id="name" label="성명" manual placeholder="이름을 입력해주세요" />
          <FieldRow id="birth" label="생년월일" manual placeholder="예: 1954-03-15" />
          <FieldRow id="phone" label="연락처" manual placeholder="010-0000-0000" hint="연락 가능한 번호를 입력해주세요." />
          <FieldRow id="address" label="주소" manual placeholder="거주지 주소를 입력해주세요" />

          <h3 style={{ margin: '24px 0 18px', fontSize: '1.1rem' }}>💳 지급 정보</h3>
          <FieldRow id="bank" label="입금 계좌 (본인 명의)" manual placeholder="은행명 계좌번호" />

          <h3 style={{ margin: '24px 0 18px', fontSize: '1.1rem' }}>📊 소득·가족 정보</h3>
          <FieldRow id="income" label="월 소득" manual placeholder="월 소득을 입력해주세요" />
          <FieldRow id="family" label="가족 구성" manual placeholder="예: 배우자 1명" />

          <h3 style={{ margin: '24px 0 18px', fontSize: '1.1rem' }}>📝 신청 사유 (선택)</h3>
          <FieldRow id="reason" label="특이사항·추가 설명" manual multi placeholder="특별히 알리고 싶은 사유가 있다면 적어주세요." />
        </div>

        <div className="banner warn" style={{ marginTop: 20 }}>
          <Icon name="info" size={18} />
          <div>본 초안은 <b>참고용</b>입니다. 신청 전 내용을 반드시 확인하시고, 최종 제출은 복지로 또는 주민센터에서 진행해주세요.</div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, flexWrap: 'wrap' }}>
          <Link href="/report" className="btn btn-ghost">
            <Icon name="download" size={16} /> 리포트 저장
          </Link>
          {candidate?.application_url ? (
            <a href={candidate.application_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              복지로에서 신청하기 <Icon name="external" size={16} color="#fff" />
            </a>
          ) : (
            <button className="btn btn-primary">
              복지로에서 신청하기 <Icon name="external" size={16} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
