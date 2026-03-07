import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  await connectDB();
  const { email } = await request.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'მომხმარებელი არ მოიძებნა' }, { status: 404 });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = code;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'GAMITSVALE.GE — პაროლის აღდგენა',
    html: `<h2>აღდგენის კოდი: <b>${code}</b></h2>`,
  });

  return NextResponse.json({ success: true });
}