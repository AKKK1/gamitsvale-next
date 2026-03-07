import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  await connectDB();
  const { email, name, avatar } = await request.json();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name,
      avatar,
      isVerified: true,
      balance: 0,
    });
  } else {
    if (avatar && !user.avatar) {
      user.avatar = avatar;
      await user.save();
    }
  }

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
