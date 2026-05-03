'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icons';
import type { ChatResponse, ServiceSelectData, WelfareCandidate } from '@/lib/types';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const stageLabels = [
  { label: '기본정보', range: [0, 2] as [number, number] },
  { label: '소득/재산', range: [2, 4] as [number, number] },
  { label: '가구 현황', range: [4, 6] as [number, number] },
  { label: '분석', range: [6, 6] as [number, number] },
];

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<WelfareCandidate[]>([]);
  const [isServiceSelect, setIsServiceSelect] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // 세션 시작 (StrictMode 이중 실행 방지)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startChat();
  }, []);

  const addBotMessage = (text: string) => {
    setMessages((m) => [...m, { role: 'bot', text }]);
  };

  const addUserMessage = (text: string) => {
    setMessages((m) => [...m, { role: 'user', text }]);
  };

  const handleResponse = (res: ChatResponse) => {
    setThreadId(res.thread_id);

    if (res.type === 'interview') {
      const data = res.data as { question: string; missing_fields: string[] };
      addBotMessage(data.question);
      setStep((s) => s + 1);
      setIsServiceSelect(false);

    } else if (res.type === 'service_select') {
      const data = res.data as ServiceSelectData;
      setCandidates(data.welfare_candidates);
      setIsServiceSelect(true);
      addBotMessage(
        data.error
          ? `${data.error}\n\n${data.candidates}`
          : data.candidates,
      );

    } else if (res.type === 'done') {
      addBotMessage('분석이 완료됐어요! 결과 페이지로 이동합니다. ✨');
      // 결과 데이터 세션 스토리지에 저장
      try { sessionStorage.setItem('chatResult', JSON.stringify(res.data)); } catch {}
      setTimeout(() => router.push('/results'), 1200);

    } else if (res.type === 'no_results') {
      addBotMessage(
        '죄송합니다. 입력하신 정보로는 현재 조건에 맞는 복지 서비스를 찾을 수 없습니다.\n\n더 자세한 안내를 원하시면 가까운 주민센터를 방문해 주세요.',
      );
    }
  };

  const startChat = async () => {
    setLoading(true);
    setError(null);
    setMessages([{ role: 'bot', text: '안녕하세요! 저는 복지봇이에요. 😊 받을 수 있는 복지 혜택을 함께 찾아드릴게요.' }]);
    try {
      const res = await fetch('/api/chat/start', { method: 'POST' });
      if (!res.ok) throw new Error('서버 오류');
      const data: ChatResponse = await res.json();
      handleResponse(data);
    } catch {
      setError('AI 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = async (message: string) => {
    if (!threadId || loading || !message.trim()) return;

    addUserMessage(message);
    setInput('');
    setLoading(true);
    setError(null);
    setIsServiceSelect(false);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: threadId, message }),
      });
      if (!res.ok) throw new Error('서버 오류');
      const data: ChatResponse = await res.json();
      handleResponse(data);
    } catch {
      setError('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const selectService = (candidate: WelfareCandidate) => {
    submitMessage(String(candidate.priority));
  };

  const pct = Math.min(100, Math.round((step / 6) * 100));
  const currentStage = stageLabels.findIndex((s) => step >= s.range[0] && step < s.range[1]);

  return (
    <div className="chat-wrap screen">
      {/* 진행 바 */}
      <div className="progress-bar-wrap">
        <div className="progress-steps">
          {stageLabels.map((s, i) => (
            <span key={i}>
              <span className={`progress-step ${i === currentStage ? 'active' : ''} ${i < currentStage ? 'done' : ''}`}>
                {i < currentStage && <Icon name="check" size={12} />}
                {i + 1}단계 {s.label}
              </span>
              {i < stageLabels.length - 1 && <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>→</span>}
            </span>
          ))}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="privacy-banner">
          <Icon name="lock" size={16} /> 입력하신 정보는 기기 밖으로 전송되지 않습니다
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="chat-scroll" ref={scrollRef}>
        <div className="chat-list">
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role}`}>
              {m.role === 'bot' && <div className="avatar-bot">복</div>}
              <div className={`bubble ${m.role}`} style={{ whiteSpace: 'pre-line' }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg-row bot">
              <div className="avatar-bot">복</div>
              <div className="bubble bot loading"><span /><span /><span /></div>
            </div>
          )}
          {error && (
            <div style={{ textAlign: 'center', padding: '12px', color: 'var(--danger)', fontSize: '0.9rem' }}>
              {error}
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={startChat}>
                다시 시작
              </button>
            </div>
          )}

          {/* 서비스 선택 카드 목록 */}
          {isServiceSelect && !loading && candidates.length > 0 && (
            <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: 10, paddingLeft: 46 }}>
              {candidates.map((c) => (
                <button
                  key={c.serv_id}
                  onClick={() => selectService(c)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 18px',
                    borderRadius: 14,
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'border-color .15s, box-shadow .15s',
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
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 4 }}>
                    {c.priority}. {c.serv_nm}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginBottom: 6 }}>
                    {c.department}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                    {c.serv_dgst.slice(0, 80)}...
                  </div>
                  {c.eligibility_reason && (
                    <div style={{ marginTop: 6, fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>
                      → {c.eligibility_reason}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 입력창 */}
      <div className="chat-input-wrap">
        <form
          className="chat-input"
          onSubmit={(e) => { e.preventDefault(); submitMessage(input.trim()); }}
        >
          <input
            type="text"
            placeholder={isServiceSelect ? '번호를 입력하거나 위 목록에서 선택해주세요' : '직접 입력하거나 위 선택지를 눌러주세요'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            aria-label="메시지 입력"
          />
          <button type="button" className="icon-btn" aria-label="음성 입력" title="음성 입력">
            <Icon name="mic" size={22} />
          </button>
          <button type="submit" className="icon-btn primary" aria-label="보내기" disabled={loading || !input.trim()}>
            <Icon name="send" size={20} color="#fff" />
          </button>
        </form>
      </div>
    </div>
  );
}
