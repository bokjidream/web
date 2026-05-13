'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import type { DoneData, WelfareCandidate } from '@/lib/types';

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

export default function Form() {
  const [candidate, setCandidate] = useState<WelfareCandidate | null>(null);
  const [applicationGuide, setApplicationGuide] = useState<string>('');
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
        if (!raw && result.selected_service) {
          setCandidate(result.selected_service);
        }
      }
    } catch {}
  }, []);

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
        <Link href="/results" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← 결과 목록으로
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
