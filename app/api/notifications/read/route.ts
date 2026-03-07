import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await Notification.updateMany(
    { user: decoded.id, isRead: false },
    { isRead: true }
  );

  return NextResponse.json({ success: true });
}