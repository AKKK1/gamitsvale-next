import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  await connectDB();
  const { email, name, password } = await request.json();

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'ემაილი უკვე გამოყენებულია' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    email, name,
    password: hashedPassword,
    verificationCode,
    isVerified: false,
    balance: 0,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'GAMITSVALE.GE — ვერიფიკაცია',
    html: `<h2>კოდი: <b>${verificationCode}</b></h2>`,
  });

  return NextResponse.json({ success: true });
}