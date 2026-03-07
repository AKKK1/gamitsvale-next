import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  await connectDB();
  const { email, code } = await request.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'მომხმარებელი არ მოიძებნა' }, { status: 404 });
  if (user.verificationCode !== code) return NextResponse.json({ error: 'არასწორი კოდი' }, { status: 400 });

  user.isVerified = true;
  user.verificationCode = undefined;
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );

  const res = NextResponse.json({ user });
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return res;
}