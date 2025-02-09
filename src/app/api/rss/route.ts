import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL não fornecida' }, { status: 400 });
    }

    console.log(`🔍 Buscando RSS: ${url}`);

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar RSS: ${response.statusText}`);
    }

    const xmlData = await response.text();
    return new NextResponse(xmlData, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('❌ Erro ao buscar RSS:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
