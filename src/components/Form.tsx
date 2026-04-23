'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import type { WelfareService } from '@/lib/types';

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
  const [selected, setSelected] = useState<WelfareService | null>(null);
  const [fields, setFields] = useState<Fields>({
    name: '김복지',
    birth: '1954-03-15',
    phone: '',
    address: '서울특별시 OO구 행복로 123',
    bank: '국민은행 123-45-6789',
    income: '월 82만원 (국민연금)',
    family: '배우자 1명',
    reason: '',
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('selectedService');
      if (raw) setSelected(JSON.parse(raw));
    } catch {}
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const s = selected || { name: '기초연금', dept: '보건복지부' };

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
          <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>{s.dept} · 신청서 초안</div>
          <h1 style={{ margin: '4px 0 0', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{s.name} 신청서 초안</h1>
        </div>

        <div className="banner info">
          <Icon name="sparkles" size={18} />
          <div>
            <b>인터뷰 내용을 바탕으로 신청서 초안을 작성했어요.</b><br />
            파란색은 자동 입력된 항목, <span style={{ color: '#B87B24', fontWeight: 600 }}>노란색</span>은 직접 확인·수정이 필요한 항목이에요.
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '1.1rem' }}>👤 기본 정보</h3>
          <FieldRow id="name" label="성명" />
          <FieldRow id="birth" label="생년월일" />
          <FieldRow id="phone" label="연락처" manual placeholder="010-0000-0000" hint="연락 가능한 번호를 입력해주세요." />
          <FieldRow id="address" label="주소" />

          <h3 style={{ margin: '24px 0 18px', fontSize: '1.1rem' }}>💳 지급 정보</h3>
          <FieldRow id="bank" label="입금 계좌 (본인 명의)" />

          <h3 style={{ margin: '24px 0 18px', fontSize: '1.1rem' }}>📊 소득·가족 정보</h3>
          <FieldRow id="income" label="월 소득" />
          <FieldRow id="family" label="가족 구성" />

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
          <button className="btn btn-primary">
            복지로에서 신청하기 <Icon name="external" size={16} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
