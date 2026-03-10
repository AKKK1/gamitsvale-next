import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Offer, Notification, Listing } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { listing: listingId, receiver, description, images } = body;

  // დღიური ლიმიტი — 15
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const dailyCount = await Offer.countDocuments({
    sender: decoded.id,
    createdAt: { $gte: todayStart }
  });
  if (dailyCount >= 15)
    return NextResponse.json({ error: 'დღიური ლიმიტი ამოწურულია (15 შეთავაზება)' }, { status: 429 });

  // ერთი განცხადებისთვის მაქს 3
  const perListingCount = await Offer.countDocuments({
    sender: decoded.id,
    listing: listingId
  });
  if (perListingCount >= 3)
    return NextResponse.json({ error: 'ამ განცხადებაზე მაქსიმუმ 3 შეთავაზებაა დაშვებული' }, { status: 429 });

  const offer = await Offer.create({
    listing: listingId,
    receiver,
    description,
    sender: decoded.id,
    images: images || []
  });

  await Notification.create({
    user: receiver,
    type: 'NEW_OFFER',
    offer: offer._id
  });

  return NextResponse.json(offer, { status: 201 });
}