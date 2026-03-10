import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';

export async function POST(request: Request) {
  const { id, pass } = await request.json();

  if (
    id === process.env.ADMIN_USERNAME &&
    pass === process.env.ADMIN_PASSWORD
  ) {
    await connectDB();

    // ადმინის რეალური იუზერი ბაზიდან
    const adminUser = await User.findOne({ role: 'ADMIN' });

    const token = jwt.sign(
      { 
        id: adminUser ? adminUser._id.toString() : 'admin', 
        role: 'ADMIN' 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const res = NextResponse.json({ success: true });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return res;
  }

  return NextResponse.json({ error: 'არასწორი მონაცემები' }, { status: 401 });
}