import { NextRequest, NextResponse } from 'next/server';

const AI_URL = process.env.AI_AGENT_URL ?? 'http://localhost:8000';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ thread_id: string }> },
) {
  const { thread_id } = await params;
  const safeThread = encodeURIComponent(thread_id.replace(/[/\\]/g, ''));

  try {
    const upstream = await fetch(`${AI_URL}/forms/${safeThread}/fields`, {
      signal: AbortSignal.timeout(60_000),
    });
    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { detail?: string }).detail ?? '필드를 가져올 수 없습니다.' },
        { status: upstream.status || 502 },
      );
    }
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'AI 서버에 연결할 수 없습니다.' }, { status: 503 });
  }
}
