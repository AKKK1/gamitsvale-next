import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Offer, Listing, Notification } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();
  const offer = await Offer.findOne({ _id: id, receiver: decoded.id });
  if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  offer.status = status;
  await offer.save();

  if (status === 'ACCEPTED')
    await Listing.findByIdAndUpdate(offer.listing, { isTraded: true });

  await Notification.create({
    user: offer.sender,
    type: status === 'ACCEPTED' ? 'OFFER_ACCEPTED'
        : status === 'DECLINED' ? 'OFFER_DECLINED'
        : 'OFFER_THINKING',
    offer: offer._id
  });

  return NextResponse.json(offer);
}