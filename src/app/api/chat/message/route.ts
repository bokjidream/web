import { NextRequest, NextResponse } from 'next/server';

const AI_URL = process.env.AI_AGENT_URL ?? 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.thread_id || !body.message) {
      return NextResponse.json(
        { error: 'thread_id와 message가 필요합니다.' },
        { status: 400 },
      );
    }

    const res = await fetch(`${AI_URL}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: body.thread_id, message: body.message }),
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
