'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Icon from './Icons';
import type { ChatResponse, DoneData, DraftField, DraftFieldsData, ReferenceDoc, WelfareCandidate } from '@/lib/types';

type ReportStage = 'service_detail' | 'draft_input' | 'final_report';
type LoadingPhase = 'idle' | 'analyzing' | 'filling' | 'reporting';

// service_detail은 자동 로딩 전환 화면 — 사용자에게 보이는 단계는 2개
const REPORT_STAGES: Array<{ key: ReportStage; label: string }> = [
  { key: 'draft_input',   label: '정보 입력'   },
  { key: 'final_report',  label: '리포트 완성' },
];

const STAGE_PCT: Record<ReportStage, number> = {
  service_detail: 0,
  draft_input:    50,
  final_report:   100,
};

const LOADING_MESSAGES: Record<LoadingPhase, string> = {
  idle:      '',
  analyzing: '신청서 분석 중...',
  filling:   '자동 입력 중... (10~30초 소요)',
  reporting: '리포트 생성 중...',
};

const FILE_TYPE_COLOR: Record<string, string> = { hwp: '#3182CE', hwpx: '#3182CE' };

export default function Report() {
  const [data, setData] = useState<DoneData | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [stage, setStage] = useState<ReportStage>('service_detail');

  // draft_input 단계 state
  const [draftFields, setDraftFields] = useState<DraftField[]>([]);
  const [draftFormTitle, setDraftFormTitle] = useState('신청서');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 공통 로딩
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('idle');

  // final_report 단계
  const [shareToast, setShareToast] = useState(false);
  const reportingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStarted = useRef(false);

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('chatResult');
      const parsed: DoneData | null = raw ? JSON.parse(raw) : null;
      if (parsed) {
        setData(parsed);
        if (parsed.final_report) {
          setStage('final_report');
        } else {
          const draftRaw = sessionStorage.getItem('draftFields');
          if (draftRaw) {
            const d: DraftFieldsData = JSON.parse(draftRaw);
            setDraftFields(d.fields);
            setDraftFormTitle(d.form_title);
            setFieldValues(Object.fromEntries(d.fields.map((f) => [f.id, ''])));
            setStage('draft_input');
          } else {
            setStage('service_detail');
          }
        }
      }
      const tid = sessionStorage.getItem('chatThreadId');
      if (tid) setThreadId(tid);
    } catch {}
  }, []);

  useEffect(() => () => {
    if (reportingTimerRef.current) clearTimeout(reportingTimerRef.current);
  }, []);

  // service_detail 단계 진입 시 자동으로 HWP 스캔 시작
  useEffect(() => {
    if (stage !== 'service_detail' || !threadId || autoStarted.current) return;
    autoStarted.current = true;
    startDraft();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, threadId]);

  const startDraft = async () => {
    if (!threadId || draftLoading) return;
    setDraftLoading(true);
    setDraftError(null);
    setLoadingPhase('analyzing');
    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, message: '__start_draft__' }),
      });
      if (!res.ok) throw new Error('서버 오류');
      const chatRes: ChatResponse = await res.json();

      if (chatRes.type === 'draft_fields') {
        const d = chatRes.data as DraftFieldsData;
        try { sessionStorage.setItem('draftFields', JSON.stringify(d)); } catch {}
        setDraftFields(d.fields);
        setDraftFormTitle(d.form_title);
        setFieldValues(Object.fromEntries(d.fields.map((f) => [f.id, ''])));
        setStage('draft_input');
      } else if (chatRes.type === 'done') {
        const done = chatRes.data as DoneData;
        try { sessionStorage.setItem('chatResult', JSON.stringify(done)); } catch {}
        setData(done);
        setStage('final_report');
      } else {
        setDraftError('예상치 못한 응답입니다. 다시 시도해주세요.');
      }
    } catch {
      setDraftError('AI 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setDraftLoading(false);
      setLoadingPhase('idle');
    }
  };

  const submitDraft = async () => {
    if (!threadId || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setLoadingPhase('filling');
    reportingTimerRef.current = setTimeout(() => setLoadingPhase('reporting'), 8000);
    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, message: JSON.stringify(fieldValues) }),
      });
      if (!res.ok) throw new Error('서버 오류');
      const chatRes: ChatResponse = await res.json();
      if (chatRes.type === 'done') {
        const done = chatRes.data as DoneData;
        try {
          sessionStorage.setItem('chatResult', JSON.stringify(done));
          sessionStorage.removeItem('draftFields');
        } catch {}
        setData(done);
        setDraftFields([]);
        setStage('final_report');
      } else {
        setSubmitError('예상치 못한 응답입니다. 다시 시도해주세요.');
      }
    } catch {
      setSubmitError('AI 서버에 연결할 수 없습니다. 다시 시도해주세요.');
    } finally {
      if (reportingTimerRef.current) clearTimeout(reportingTimerRef.current);
      setSubmitting(false);
      setLoadingPhase('idle');
    }
  };

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

  const selected: WelfareCandidate | null | undefined = data.selected_service;
  const stageIndex = REPORT_STAGES.findIndex((s) => s.key === stage);
  const pct = STAGE_PCT[stage];

  // ── 공통: 2단계 진행 표시기 (service_detail은 로딩 전환 화면 — 단계 미포함) ──
  const StepIndicator = (
    <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 20px', marginBottom: 20 }}>
      <div className="progress-steps" style={{ marginBottom: 10 }}>
        {REPORT_STAGES.map((s, i) => (
          <span key={s.key}>
            <span className={`progress-step ${i === stageIndex ? 'active' : ''} ${i < stageIndex ? 'done' : ''}`}>
              {i < stageIndex && <Icon name="check" size={12} />}
              {i + 1}단계 {s.label}
            </span>
            {i < REPORT_STAGES.length - 1 && <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>→</span>}
          </span>
        ))}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );

  // ── 로딩 화면 (service_detail): 서비스 안내 표시 + HWP 스캔 대기 ─────────────
  if (stage === 'service_detail') {
    return (
      <div className="screen" style={{ padding: '32px 0 80px' }}>
        <div className="narrow">
          <Link href="/chat" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>← 진단 다시하기</Link>
          {StepIndicator}

          {selected && (
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 6 }}>
                <Icon name="building" size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{selected.department}
              </div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{selected.serv_nm}</h1>
              {selected.serv_dgst && (
                <p style={{ color: 'var(--text-sub)', margin: '10px 0 0', fontSize: '0.95rem', lineHeight: 1.7 }}>{selected.serv_dgst}</p>
              )}
            </div>
          )}

          {data.document_guidance && (
            <details style={{ marginBottom: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.93rem', color: 'var(--text)', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="sparkles" size={16} color="var(--primary)" /> 📋 필요 서류 확인하기
              </summary>
              <div style={{ marginTop: 10, whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{data.document_guidance}</div>
            </details>
          )}

          {data.application_guide && (
            <details style={{ marginBottom: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.93rem', color: 'var(--text)', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="doc" size={16} color="var(--primary)" /> 📄 신청 절차 확인하기
              </summary>
              <div style={{ marginTop: 10, whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{data.application_guide}</div>
            </details>
          )}

          {draftError ? (
            <div style={{ padding: '16px 20px', background: 'var(--danger-light)', borderRadius: 12, border: '1px solid var(--danger)', marginBottom: 12 }}>
              <div style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: 10 }}>{draftError}</div>
              <button className="btn btn-primary btn-sm" onClick={() => { autoStarted.current = false; startDraft(); }}>
                다시 시도
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div className="bubble bot loading" style={{ flexShrink: 0 }}><span /><span /><span /></div>
              <span style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>{LOADING_MESSAGES.analyzing}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 1단계: 정보 입력 뷰 ──────────────────────────────────────────────────────
  if (stage === 'draft_input') {
    return (
      <div className="screen" style={{ padding: '32px 0 80px' }}>
        <div className="narrow">
          <Link href="/chat" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>← 진단 다시하기</Link>
          {StepIndicator}

          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>{selected?.department ?? ''} · 신청서 초안</div>
            <h1 style={{ margin: '4px 0 0', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>{selected?.serv_nm ?? '복지 서비스'} 신청서</h1>
          </div>

          {data?.document_guidance && (
            <details style={{ marginBottom: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.93rem', color: 'var(--text)', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="sparkles" size={16} color="var(--primary)" /> 📋 필요 서류 확인하기
              </summary>
              <div style={{ marginTop: 10, whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{data.document_guidance}</div>
            </details>
          )}

          {data?.application_guide && (
            <details style={{ marginBottom: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.93rem', color: 'var(--text)', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="doc" size={16} color="var(--primary)" /> 📄 신청 절차 확인하기
              </summary>
              <div style={{ marginTop: 10, whiteSpace: 'pre-line', fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.7 }}>{data.application_guide}</div>
            </details>
          )}

          <div style={{ padding: '24px', background: 'var(--surface)', border: '1.5px solid var(--primary)', borderRadius: 14, marginBottom: 20, boxShadow: '0 4px 14px rgba(83,122,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Icon name="sparkles" size={18} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)' }}>{draftFormTitle} — 입력 필요 항목</h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: 'var(--text-sub)' }}>
              아래 항목을 입력해주세요. 나머지는 AI가 인터뷰 내용을 바탕으로 자동 채워드립니다.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              {draftFields.map((f) => (
                <div key={f.id} className="field manual">
                  <label htmlFor={`f_${f.id}`}>{f.label}</label>
                  <input
                    id={`f_${f.id}`}
                    type="text"
                    value={fieldValues[f.id] ?? ''}
                    onChange={(e) => setFieldValues((v) => ({ ...v, [f.id]: e.target.value }))}
                    placeholder={f.label + ' 입력'}
                  />
                </div>
              ))}
            </div>
            {submitError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.88rem', marginTop: 10, padding: '8px 12px', background: 'var(--danger-light)', borderRadius: 8 }}>
                {submitError}
              </div>
            )}
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 16 }}
              onClick={submitDraft}
              disabled={submitting}
            >
              {submitting ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: 0.7 }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: 0.7 }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: 0.7 }} />
                  <span style={{ marginLeft: 4 }}>{LOADING_MESSAGES[loadingPhase]}</span>
                </span>
              ) : (
                <><Icon name="sparkles" size={18} color="#fff" /> 신청서 자동 채우기</>
              )}
            </button>
          </div>

          <div className="banner warn">
            <Icon name="info" size={18} />
            <div>본 초안은 <b>참고용</b>입니다. 신청 전 내용을 반드시 확인하고, 최종 제출은 복지로 또는 주민센터에서 진행해주세요.</div>
          </div>
        </div>
      </div>
    );
  }

  // ── 3단계: 최종 리포트 뷰 ────────────────────────────────────────────────────
  const finalReport = data.final_report ?? '';
  const filledForms = data.filled_forms ?? [];
  const successForms = filledForms.filter((f) => f.status === 'success');
  const guideForms = filledForms.filter((f) => f.status === 'guide_only');
  const skippedForms = filledForms.filter((f) => f.status === 'skipped');
  const failedForms = filledForms.filter((f) => f.status === 'failed');
  const referenceDocs: ReferenceDoc[] = data.reference_docs ?? [];
  const applicationUrl = data.selected_service?.application_url ?? null;
  const servNm = data.selected_service?.serv_nm ?? '복지 서비스';

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

        {StepIndicator}

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

            {/* AI 리포트 */}
            {finalReport && (
              <>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📋 AI 분석 리포트</h3>
                <div style={{ padding: '20px 24px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text)', marginBottom: 28 }}>
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

            {/* 자동 작성된 신청서 다운로드 */}
            {(successForms.length > 0 || guideForms.length > 0 || skippedForms.length > 0 || failedForms.length > 0) && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📎 신청서 초안 다운로드</h3>

                {/* 자동 입력 완료 */}
                {successForms.length > 0 && (
                  <div style={{ marginBottom: 16, padding: '22px 24px', background: 'linear-gradient(135deg, rgba(83,122,255,0.08), rgba(83,122,255,0.03))', border: '1.5px solid var(--primary)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Icon name="sparkles" size={18} color="var(--primary)" />
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary)' }}>AI가 작성한 신청서 초안</h4>
                    </div>
                    <p style={{ margin: '4px 0 14px', fontSize: '0.88rem', color: 'var(--text-sub)' }}>다운로드 후 내용을 확인하고 부족한 부분만 수정하세요.</p>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {successForms.map((form, i) => {
                        const fileName = form.download_key.split('/').pop() ?? `form_${i}.${form.file_type}`;
                        const typeColor = FILE_TYPE_COLOR[form.file_type] ?? '#718096';
                        return (
                          <a key={form.download_key} href={`/api/forms/download/${form.download_key}`} download={fileName}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', transition: 'border-color .15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, background: typeColor + '18', color: typeColor, fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                              {form.file_type.toUpperCase()}
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.original_title}</span>
                              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: 2 }}>✨ AI 자동입력 완료</span>
                            </span>
                            <Icon name="download" size={16} color="var(--primary)" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PDF 작성 가이드 */}
                {guideForms.map((form, i) => (
                  <div key={i} style={{ padding: '22px 24px', background: 'var(--warning-light)', border: '1.5px solid #F3D58C', borderRadius: 14, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Icon name="doc" size={18} color="#B87B24" />
                      <span style={{ fontWeight: 700, color: '#8F5C1A' }}>{form.original_title} — PDF 직접 작성 필요</span>
                    </div>
                    {form.guide_text && <div style={{ fontSize: '0.88rem', whiteSpace: 'pre-line', color: 'var(--text)', marginBottom: 10 }}>{form.guide_text}</div>}
                    <a href={form.original_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      <Icon name="download" size={13} /> 원본 PDF 다운로드
                    </a>
                  </div>
                ))}

                {/* 자동 채우기 미지원 원본 */}
                {skippedForms.length > 0 && (
                  <div style={{ padding: '22px 24px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Icon name="doc" size={18} color="var(--text-sub)" />
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>원본 신청서</h4>
                    </div>
                    <p style={{ margin: '4px 0 14px', fontSize: '0.88rem', color: 'var(--text-sub)' }}>자동 채우기를 지원하지 않는 형식이에요. 아래 파일을 받아 직접 작성해 주세요.</p>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {skippedForms.map((form, i) => {
                        const fileName = form.download_key.split('/').pop() ?? `form_${i}.${form.file_type}`;
                        const typeColor = FILE_TYPE_COLOR[form.file_type] ?? '#718096';
                        return (
                          <a key={form.download_key} href={`/api/forms/download/${form.download_key}`} download={fileName}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', transition: 'border-color .15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, background: typeColor + '18', color: typeColor, fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                              {form.file_type.toUpperCase()}
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.original_title}</span>
                              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: 2 }}>원본 파일 다운로드</span>
                            </span>
                            <Icon name="download" size={16} color="var(--primary)" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 처리 실패 신청서 */}
            {failedForms.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                {failedForms.map((form, i) => (
                  <div key={i} style={{ padding: '18px 22px', background: 'var(--danger-light)', border: '1.5px solid var(--danger)', borderRadius: 14, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Icon name="info" size={18} color="var(--danger)" />
                      <span style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.95rem' }}>{form.original_title} — 자동 처리 실패</span>
                    </div>
                    {form.error && <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: 8 }}>{form.error}</div>}
                    {form.original_url && (
                      <a href={form.original_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                        <Icon name="download" size={13} /> 원본 파일 직접 받기
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 참고 자료 및 안내문 */}
            {referenceDocs.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>📄 참고 자료 및 안내문</h3>
                <div style={{ padding: '22px 24px', background: 'linear-gradient(135deg, rgba(52,168,83,0.08), rgba(52,168,83,0.03))', border: '1.5px solid #34A853', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Icon name="doc" size={18} color="#34A853" />
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#34A853' }}>더 자세한 내용을 확인하세요</h4>
                  </div>
                  <p style={{ margin: '4px 0 14px', fontSize: '0.88rem', color: 'var(--text-sub)' }}>서비스 안내문 및 공문을 확인하고 신청 전 참고하세요.</p>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {referenceDocs.map((doc, i) => {
                      const ext = doc.url.split('.').pop()?.toLowerCase() ?? '';
                      const fileType = ['pdf', 'hwp', 'hwpx'].includes(ext) ? ext : 'file';
                      const typeColor = fileType === 'pdf' ? '#E53E3E' : fileType === 'hwp' || fileType === 'hwpx' ? '#3182CE' : '#718096';
                      return (
                        <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', transition: 'border-color .15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#34A853'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, background: typeColor + '18', color: typeColor, fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                            {fileType.toUpperCase()}
                          </span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</span>
                            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: 2 }}>참고 안내문 · 새 탭에서 열기</span>
                          </span>
                          <Icon name="download" size={16} color="#34A853" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 복지로 직접 신청 링크 */}
            {applicationUrl && (
              <div style={{ marginBottom: 28, padding: '20px 24px', background: 'var(--primary-light, #EBF2FF)', border: '1.5px solid var(--primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>🔗 복지로에서 자세히 보기</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)' }}>복지로에서 {servNm} 상세 정보와 신청 방법을 확인하세요.</div>
                </div>
                <a href={applicationUrl} target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  복지로 바로가기
                </a>
              </div>
            )}

            <div className="footer-disclaimer" style={{ marginTop: 28 }}>
              <b>⚠️ 안내</b> 본 리포트는 AI 사전 진단 결과로, 최종 수급 확정은 행정기관의 심사를 거칩니다.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleShare}><Icon name="share" size={14} /> 가족에게 공유</button>
          <button className="btn btn-ghost btn-sm" onClick={handlePdf}><Icon name="download" size={14} /> PDF로 저장</button>
        </div>
      </div>
    </div>
  );
}
