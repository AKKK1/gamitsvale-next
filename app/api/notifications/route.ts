import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = await Notification.find({ user: decoded.id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'offer',
      populate: { path: 'sender', select: 'name avatar' }
    });

  return NextResponse.json(notifications);
}