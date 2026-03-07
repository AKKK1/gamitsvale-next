import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Settings } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  await connectDB();
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded || decoded.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json(settings);
}