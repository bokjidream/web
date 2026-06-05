import { NextResponse } from 'next/server';

const AI_URL = process.env.AI_AGENT_URL ?? 'http://localhost:8000';

export async function POST() {
  try {
    const res = await fetch(`${AI_URL}/chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'AI 서버 오류가 발생했습니다.' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'AI 서버에 연결할 수 없습니다.' },
      { status: 503 },
    );
  }
}
