import { NextRequest, NextResponse } from 'next/server';

const AI_URL = process.env.AI_AGENT_URL ?? 'http://localhost:8000';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ thread_id: string }> },
) {
  const { thread_id } = await params;
  const safeThread = encodeURIComponent(thread_id.replace(/[/\\]/g, ''));

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${AI_URL}/forms/${safeThread}/fill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });
    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { detail?: string }).detail ?? 'HWP 파일 생성에 실패했습니다.' },
        { status: upstream.status || 502 },
      );
    }
    const data = await upstream.json() as { download_url?: string };
    // AI 서버의 /forms/download/... 경로를 웹 프록시 경로로 변환
    if (data.download_url) {
      data.download_url = `/api${data.download_url}`;
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'AI 서버에 연결할 수 없습니다.' }, { status: 503 });
  }
}
