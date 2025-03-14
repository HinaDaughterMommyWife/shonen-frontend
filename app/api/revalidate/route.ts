import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    revalidateTag('survey');
    revalidateTag('historical');
    return NextResponse.json({ message: 'Mesugaki revalidada correctamente 💢' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al revalidar' }, { status: 500 });
  }
}
