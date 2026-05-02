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

function verificationEmailHtml(code: string, name: string, email: string) {
  const appUrl = process.env.APP_URL || 'https://gamitsvale.ge';
  const activationLink = `${appUrl}/verify?email=${encodeURIComponent(email)}&code=${code}`;

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f8faf8;font-family:Arial,sans-serif">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8ebe8">
        <div style="background:#1a8a4a;padding:24px;text-align:center">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:2px">GAMITSVALE.GE</h1>
        </div>
        <div style="padding:32px;text-align:center">
          <p style="color:#555;font-size:15px;margin-bottom:8px">გამარჯობა, <strong style="color:#111">${name}</strong>!</p>
          <p style="color:#555;font-size:14px;margin-bottom:28px">ანგარიშის გასააქტიურებლად დააჭირე ღილაკს:</p>

          <a href="${activationLink}"
             style="display:inline-block;background:#1a8a4a;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:12px;font-size:16px;font-weight:900;letter-spacing:1px;margin-bottom:28px">
            ✅ ანგარიშის გააქტიურება
          </a>

          <p style="color:#999;font-size:12px;margin-bottom:8px">ღილაკი არ მუშაობს? დააკოპირე ლინკი:</p>
          <p style="color:#1a8a4a;font-size:11px;word-break:break-all;background:#e6f5ec;padding:10px;border-radius:8px">
            ${activationLink}
          </p>

          <p style="color:#bbb;font-size:11px;margin-top:20px">ლინკი მოქმედია 30 წუთი</p>
        </div>
        <div style="padding:16px;border-top:1px solid #e8ebe8;text-align:center">
          <p style="color:#bbb;font-size:11px;margin:0">© 2025 GAMITSVALE.GE</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  await connectDB();

  const { email, name, lastName, password, phone, whatsapp, telegram } = await request.json();

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
  const fullName = lastName ? `${name} ${lastName}`.trim() : name.trim();

  await User.create({
    email: email.toLowerCase(),
    name: fullName,
    password: hashedPassword,
    verificationCode,
    isVerified: false,
    balance: 0,
    phone: cleanPhone,
    whatsapp: whatsapp?.trim() || '',
    telegram: telegram?.trim() || '',
  });

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"GAMITSVALE.GE" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'GAMITSVALE.GE — ანგარიშის გააქტიურება',
      html: verificationEmailHtml(verificationCode, name, email),
    });
  } catch (emailError) {
    console.error('Email send error:', emailError);
    return NextResponse.json(
      { error: 'მომხმარებელი შეიქმნა, მაგრამ მეილი ვერ გაიგზავნა.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}