import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const user = await User.findByIdAndUpdate(decoded.id, body, { new: true });
  return NextResponse.json(user);
}

export async function DELETE(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await User.findByIdAndDelete(decoded.id);
  const res = NextResponse.json({ success: true });
  res.cookies.delete('token');
  return res;
}