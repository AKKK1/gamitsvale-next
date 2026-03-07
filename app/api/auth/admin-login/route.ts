import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { id, pass } = await request.json();

  if (
    id === process.env.ADMIN_USERNAME &&
    pass === process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'არასწორი მონაცემები' }, { status: 401 });
}