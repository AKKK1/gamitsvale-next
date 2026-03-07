import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await connectDB();
  const { email, code, newPassword } = await request.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'მომხმარებელი არ მოიძებნა' }, { status: 404 });
  if (user.resetPasswordCode !== code) return NextResponse.json({ error: 'არასწორი კოდი' }, { status: 400 });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordCode = undefined;
  await user.save();

  return NextResponse.json({ success: true });
}