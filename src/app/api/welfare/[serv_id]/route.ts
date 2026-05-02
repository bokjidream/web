import { NextRequest, NextResponse } from 'next/server';

const RAG_URL = process.env.RAG_SERVICE_URL ?? 'http://localhost:8000';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ serv_id: string }> },
) {
  try {
    const { serv_id } = await params;

    const res = await fetch(`${RAG_URL}/welfare/${serv_id}`);

    if (res.status === 404) {
      return NextResponse.json(
        { error: '서비스를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

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
