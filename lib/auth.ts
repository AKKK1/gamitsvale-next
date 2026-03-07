import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import { User } from '@/lib/models.ts';
import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectDB();
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .find(c => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch {
    return null;
  }
}