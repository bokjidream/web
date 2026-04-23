'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './Icons';

interface Message {
  role: 'bot' | 'user';
  text: string;
  tip?: { term: string; text: string } | null;
}

const flow = [
  { q: '먼저 연세를 여쭤봐도 될까요?', chips: ['60대', '70대', '80대 이상', '그 외'] },
  { q: '함께 살고 있는 가족은 어떻게 되세요?', chips: ['혼자 살아요', '배우자와 둘', '자녀와 함께', '그 외'] },
  { q: '주거 형태는 어떠신가요?', chips: ['자가 (본인 소유)', '전세', '월세', '기타'] },
  { q: '한 달 소득(연금·월급 등)은 대략 얼마쯤 되세요?', chips: ['50만원 미만', '50–100만원', '100–200만원', '잘 모르겠어요'] },
  { q: '건강 상태는 어떠세요? 병원 자주 가시나요?', chips: ['건강해요', '가끔 병원에 가요', '지병이 있어요', '장애 등급이 있어요'] },
  { q: '거의 다 왔어요! 혹시 기초생활수급자이신가요?', chips: ['네, 수급자예요', '아니요', '잘 모르겠어요'] },
];

const stageLabels = [
  { label: '기본정보', range: [0, 2] as [number, number] },
  { label: '소득/재산', range: [2, 4] as [number, number] },
  { label: '가구 현황', range: [4, 6] as [number, number] },
  { label: '분석', range: [6, 6] as [number, number] },
];

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '안녕하세요! 저는 복지봇이에요. 😊 받을 수 있는 복지 혜택을 함께 찾아드릴게요.', tip: null },
    { role: 'bot', text: flow[0].q, tip: null },
  ]);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState(flow[0].chips);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const submitAnswer = (answer: string) => {
    if (loading) return;
    setMessages((m) => [...m, { role: 'user', text: answer }]);
    setChoices([]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const next = step + 1;
      if (next < flow.length) {
        setMessages((m) => [
          ...m,
          {
            role: 'bot',
            text: flow[next].q,
            tip: next === 3 ? { term: '소득', text: '연금, 근로소득, 기타 정기 수입 모두 포함한 대략적 금액입니다.' } : null,
          },
        ]);
        setChoices(flow[next].chips);
        setStep(next);
      } else {
        setMessages((m) => [
          ...m,
          { role: 'bot', text: '감사합니다! 답변을 바탕으로 받으실 수 있는 복지 혜택을 분석하고 있어요... ✨' },
        ]);
        setTimeout(() => router.push('/results'), 1500);
      }
      setLoading(false);
    }, 900);
  };

  const pct = Math.min(100, Math.round((step / flow.length) * 100));
  const currentStage = stageLabels.findIndex((s) => step >= s.range[0] && step < s.range[1]);

  return (
    <div className="chat-wrap screen">
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

      <div className="chat-scroll" ref={scrollRef}>
        <div className="chat-list">
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role}`}>
              {m.role === 'bot' && <div className="avatar-bot">복</div>}
              <div className={`bubble ${m.role}`}>
                {m.text}
                {m.tip && (
                  <>
                    {' '}
                    <span className="term" data-tip={m.tip.text}>{m.tip.term}이란?</span>
                  </>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg-row bot">
              <div className="avatar-bot">복</div>
              <div className="bubble bot loading">
                <span /><span /><span />
              </div>
            </div>
          )}
          {!loading && choices.length > 0 && (
            <div className="quick-chips">
              {choices.map((c, i) => (
                <button key={i} className="chip" onClick={() => submitAnswer(c)}>{c}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="chat-input-wrap">
        <form
          className="chat-input"
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) submitAnswer(input.trim()); }}
        >
          <input
            type="text"
            placeholder="직접 입력하거나 위 선택지를 눌러주세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="메시지 입력"
          />
          <button type="button" className="icon-btn" aria-label="음성 입력" title="음성 입력">
            <Icon name="mic" size={22} />
          </button>
          <button type="submit" className="icon-btn primary" aria-label="보내기">
            <Icon name="send" size={20} color="#fff" />
          </button>
        </form>
      </div>
    </div>
  );
}
