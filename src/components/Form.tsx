'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from './Icons';
import type { DoneData, FormInfo, WelfareCandidate } from '@/lib/types';

export default function Form() {
  const [candidate, setCandidate] = useState<WelfareCandidate | null>(null);
  const [hasHwpForms, setHasHwpForms] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [forms, setForms] = useState<FormInfo[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<number, Record<string, string>>>({});
  const [loadingFields, setLoadingFields] = useState(false);
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({});
  const [downloadUrls, setDownloadUrls] = useState<Record<number, string>>({});
  const [submitErrors, setSubmitErrors] = useState<Record<number, string>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const resultRaw = sessionStorage.getItem('chatResult');
      const tidRaw = sessionStorage.getItem('threadId');
      if (resultRaw) {
        const result: DoneData = JSON.parse(resultRaw);
        setCandidate(result.selected_service);
        setHasHwpForms(result.has_hwp_forms ?? false);
      }
      if (tidRaw) setThreadId(tidRaw);
    } catch {}
  }, []);

  useEffect(() => {
    if (!hasHwpForms || !threadId) return;

    const fetchFields = async () => {
      setLoadingFields(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/forms/${threadId}/fields`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? '필드를 가져올 수 없습니다.');
        }
        const data = await res.json() as { forms: FormInfo[] };
        setForms(data.forms);
        const initial: Record<number, Record<string, string>> = {};
        for (const form of data.forms) {
          initial[form.form_index] = {};
          for (const field of form.fields) {
            initial[form.form_index][field.label] = field.value ?? '';
          }
        }
        setFieldValues(initial);
      } catch (e) {
        setFetchError((e as Error).message);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFields();
  }, [hasHwpForms, threadId]);

  const handleFieldChange = (formIndex: number, label: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [formIndex]: { ...(prev[formIndex] ?? {}), [label]: value },
    }));
  };

  const handleSubmit = async (formIndex: number) => {
    if (!threadId) return;
    setSubmitting((prev) => ({ ...prev, [formIndex]: true }));
    setSubmitErrors((prev) => ({ ...prev, [formIndex]: '' }));

    try {
      const res = await fetch(`/api/forms/${threadId}/fill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_index: formIndex,
          field_values: fieldValues[formIndex] ?? {},
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'HWP 파일 생성에 실패했습니다.');
      }
      const data = await res.json() as { download_url: string };
      setDownloadUrls((prev) => ({ ...prev, [formIndex]: data.download_url }));
    } catch (e) {
      setSubmitErrors((prev) => ({ ...prev, [formIndex]: (e as Error).message }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [formIndex]: false }));
    }
  };

  const name = candidate?.serv_nm ?? '복지 서비스';
  const dept = candidate?.department ?? '';

  return (
    <div className="screen" style={{ padding: '32px 0 80px' }}>
      <div className="narrow">
        <Link href="/report" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← 리포트로
        </Link>

        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>{dept} · 신청서 작성</div>
          <h1 style={{ margin: '4px 0 0', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{name} 신청서</h1>
        </div>

        {hasHwpForms ? (
          <>
            {loadingFields && (
              <div className="banner info">
                <Icon name="sparkles" size={18} />
                <div>신청서 필드를 분석하고 있어요... 잠시만 기다려주세요.</div>
              </div>
            )}

            {fetchError && (
              <div className="banner warn">
                <Icon name="info" size={18} />
                <div>{fetchError}</div>
              </div>
            )}

            {!loadingFields && !fetchError && forms.length === 0 && (
              <div className="banner info">
                <Icon name="info" size={18} />
                <div>처리 가능한 HWP 신청서가 없습니다.</div>
              </div>
            )}

            {forms.map((form) => {
              const autoFields = form.fields.filter((f) => f.value !== null);
              const requiredFields = form.fields.filter((f) => f.value === null);
              const isSubmitting = submitting[form.form_index] ?? false;
              const downloadUrl = downloadUrls[form.form_index];
              const formError = submitErrors[form.form_index];

              return (
                <div key={form.form_index} className="card" style={{ padding: 28, marginBottom: 20 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{form.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 20 }}>
                    {form.file_type.toUpperCase()} 신청서
                  </div>

                  {autoFields.length > 0 && (
                    <>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="sparkles" size={14} color="var(--primary)" /> AI 자동입력 항목
                      </div>
                      {autoFields.map((field) => (
                        <div key={field.label} className="field">
                          <label>
                            {field.label}
                            <span className="field-note">
                              <Icon name="sparkles" size={12} color="var(--primary)" /> AI 자동입력
                            </span>
                          </label>
                          <input
                            value={fieldValues[form.form_index]?.[field.label] ?? ''}
                            onChange={(e) => handleFieldChange(form.form_index, field.label, e.target.value)}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {requiredFields.length > 0 && (
                    <>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#B87B24', marginBottom: 10, marginTop: autoFields.length > 0 ? 24 : 0 }}>
                        ✏️ 직접 입력이 필요한 항목
                      </div>
                      {requiredFields.map((field) => (
                        <div key={field.label} className="field manual">
                          <label>
                            {field.label}
                            <span className="field-note">✏️ 직접 입력 필요</span>
                          </label>
                          <input
                            value={fieldValues[form.form_index]?.[field.label] ?? ''}
                            onChange={(e) => handleFieldChange(form.form_index, field.label, e.target.value)}
                            placeholder={`${field.label}을(를) 입력해주세요`}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {formError && (
                    <div className="banner warn" style={{ marginTop: 12 }}>
                      <Icon name="info" size={16} />
                      <div>{formError}</div>
                    </div>
                  )}

                  {downloadUrl ? (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 10 }}>
                        ✅ 신청서가 준비됐어요!
                      </div>
                      <a
                        href={downloadUrl}
                        download
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                      >
                        <Icon name="download" size={16} color="#fff" /> {form.title} 다운로드
                      </a>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 24 }}
                      disabled={isSubmitting || loadingFields}
                      onClick={() => handleSubmit(form.form_index)}
                    >
                      {isSubmitting ? '신청서 생성 중...' : '신청서 작성 완료'}
                      {!isSubmitting && <Icon name="arrow" size={14} />}
                    </button>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="banner info">
            <Icon name="sparkles" size={18} />
            <div>
              <b>이 서비스는 HWP 신청서가 없어요.</b><br />
              아래 신청 방법을 참고하여 직접 신청해주세요.
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

        <div className="banner warn" style={{ marginTop: 20 }}>
          <Icon name="info" size={18} />
          <div>
            본 신청서는 <b>참고용</b>입니다. 신청 전 내용을 반드시 확인하시고, 최종 제출은 복지로 또는 주민센터에서 진행해주세요.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, flexWrap: 'wrap' }}>
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
