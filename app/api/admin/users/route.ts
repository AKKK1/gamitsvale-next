import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded || decoded.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(query)
    .select('name email role balance isVerified createdAt isBlocked')
    .sort({ createdAt: -1 });

  return NextResponse.json(users);
}