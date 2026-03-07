import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { User } from '@/lib/models';

export async function GET(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ user: null }, { status: 401 });
  const user = await User.findById(decoded.id).select('-password -verificationCode -resetPasswordCode');
  return NextResponse.json({ user });
}