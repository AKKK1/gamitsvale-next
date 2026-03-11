import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // username უნიკალურობის შემოწმება
  if (body.username) {
    const cleaned = body.username.replace('@', '').trim().toLowerCase();
    body.username = cleaned;
    const existing = await User.findOne({ username: cleaned, _id: { $ne: decoded.id } });
    if (existing) {
      return NextResponse.json({ error: 'ეს username უკვე გამოყენებულია' }, { status: 400 });
    }
  }

  // დასაშვები ველები (სხვა ველების შეცვლა არ შეიძლება)
  const allowed = ['phone', 'instagram', 'facebook', 'username'];
  const update: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  const user = await User.findByIdAndUpdate(decoded.id, update, { new: true });
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