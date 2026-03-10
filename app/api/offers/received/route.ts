import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { Offer } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!mongoose.Types.ObjectId.isValid(decoded.id))
    return NextResponse.json([]);

  const offers = await Offer.find({ receiver: decoded.id })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar phone instagram facebook email')
    .populate({ path: 'listing', match: { _id: { $exists: true } } });

  return NextResponse.json(offers.filter(o => o.listing !== null));
}