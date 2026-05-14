import { NextRequest, NextResponse } from 'next/server';

const RAG_URL = process.env.RAG_SERVICE_URL ?? 'http://localhost:8001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${RAG_URL}/welfare/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'RAG 서버 오류가 발생했습니다.' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'RAG 서버에 연결할 수 없습니다.' },
      { status: 503 },
    );
  }
}
