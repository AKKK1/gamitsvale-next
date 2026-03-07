import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Offer, Notification } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listing, receiver, description, images } = await request.json();

  const offer = await Offer.create({
    listing, receiver, description,
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