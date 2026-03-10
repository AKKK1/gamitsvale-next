import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Listing, Offer } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded || decoded.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [users, listings, offers, todayUsers, todayListings] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Offer.countDocuments(),
    User.countDocuments({ createdAt: { $gte: todayStart } }),
    Listing.countDocuments({ createdAt: { $gte: todayStart } }),
  ]);

  return NextResponse.json({ users, listings, offers, todayUsers, todayListings });
}