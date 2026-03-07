import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Offer } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const offers = await Offer.find({ receiver: decoded.id })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar phone instagram facebook email')
    .populate('listing');

  return NextResponse.json(offers);
}