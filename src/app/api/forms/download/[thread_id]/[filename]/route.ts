import { NextRequest, NextResponse } from 'next/server';

const AI_URL = process.env.AI_AGENT_URL ?? 'http://localhost:8000';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ thread_id: string; filename: string }> },
) {
  const { thread_id, filename } = await params;

  // 경로 인젝션 방지 — 슬래시/상위 경로 제거
  const safeThread = encodeURIComponent(thread_id.replace(/[/\\]/g, ''));
  const safeName = encodeURIComponent(filename.replace(/[/\\]/g, ''));

  try {
    const upstream = await fetch(`${AI_URL}/forms/download/${safeThread}/${safeName}`);

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: '파일을 가져올 수 없습니다.' },
        { status: upstream.status || 502 },
      );
    }

    // AI 서버 응답을 그대로 스트리밍 (파일 헤더 보존)
    const headers = new Headers();
    const ct = upstream.headers.get('content-type');
    const cd = upstream.headers.get('content-disposition');
    if (ct) headers.set('Content-Type', ct);
    if (cd) headers.set('Content-Disposition', cd);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { error: 'AI 서버에 연결할 수 없습니다.' },
      { status: 503 },
    );
  }
}
