import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

function verificationEmailHtml(code: string, name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif">
      <div style="max-width:480px;margin:40px auto;background:#141414;border-radius:16px;overflow:hidden;border:1px solid #222">
        <div style="background:#D4A017;padding:24px;text-align:center">
          <h1 style="margin:0;color:#0a0a0a;font-size:22px;font-weight:900;letter-spacing:2px">GAMITSVALE.GE</h1>
        </div>
        <div style="padding:32px;text-align:center">
          <p style="color:#aaa;font-size:15px;margin-bottom:8px">გამარჯობა, <strong style="color:#fff">${name}</strong>!</p>
          <p style="color:#aaa;font-size:14px;margin-bottom:28px">გამოიყენე კოდი ანგარიშის გასააქტიურებლად:</p>
          <div style="background:#0a0a0a;border:2px solid #D4A017;border-radius:12px;padding:20px;margin-bottom:28px;display:inline-block">
            <span style="color:#D4A017;font-size:36px;font-weight:900;letter-spacing:12px">${code}</span>
          </div>
          <p style="color:#555;font-size:12px">კოდი მოქმედია 30 წუთი</p>
        </div>
        <div style="padding:16px;border-top:1px solid #222;text-align:center">
          <p style="color:#444;font-size:11px;margin:0">© 2025 GAMITSVALE.GE</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  await connectDB();

  const {
    email,
    name,
    lastName,
    password,
    phone,
    instagram,
    facebook,
    whatsapp,
    telegram,
  } = await request.json();

  // Validation
  if (!email || !name || !password || !phone) {
    return NextResponse.json(
      { error: 'სახელი, მეილი, პაროლი და ტელეფონი სავალდებულოა' },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს' },
      { status: 400 }
    );
  }

  // Phone format — მხოლოდ ციფრები და +
  const cleanPhone = phone.replace(/\s/g, '');
  if (!/^[\+]?[0-9]{9,15}$/.test(cleanPhone)) {
    return NextResponse.json(
      { error: 'ტელეფონის ნომერი არასწორია' },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { error: 'ეს მეილი უკვე გამოყენებულია' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // სახელი + გვარი გაერთიანება
  const fullName = lastName ? `${name} ${lastName}`.trim() : name.trim();

  await User.create({
    email: email.toLowerCase(),
    name: fullName,
    password: hashedPassword,
    verificationCode,
    isVerified: false,
    balance: 0,
    phone: cleanPhone,
    // instagram: instagram?.replace('@', '').trim() || '',
    // facebook: facebook?.trim() || '',
    whatsapp: cleanPhone,
    telegram: cleanPhone,
  });

  // Email გაგზავნა
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"GAMITSVALE.GE" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'GAMITSVALE.GE — ანგარიშის ვერიფიკაცია',
      html: verificationEmailHtml(verificationCode, name),
    });
  } catch (emailError) {
    console.error('Email send error:', emailError);
    // User შეიქმნა მაგრამ მეილი ვერ გაიგზავნა
    return NextResponse.json(
      { error: 'მომხმარებელი შეიქმნა, მაგრამ მეილი ვერ გაიგზავნა. შეამოწმე MAIL_PASS .env-ში.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}