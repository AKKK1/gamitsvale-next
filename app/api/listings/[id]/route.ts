import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Listing, Offer, Notification } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const listing = await Listing.findById(id)
    .populate('owner', 'name avatar phone email instagram facebook');
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  listing.views = (listing.views || 0) + 1;
  await listing.save();

  return NextResponse.json(listing);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const listing = await Listing.findById(id);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (listing.owner.toString() !== decoded.id && decoded.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const updated = await Listing.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const listing = await Listing.findById(id);
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (listing.owner.toString() !== decoded.id && decoded.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await Listing.findByIdAndDelete(id);
  const offers = await Offer.find({ listing: id });
  const offerIds = offers.map(o => o._id);
  await Offer.deleteMany({ listing: id });
  if (offerIds.length > 0)
    await Notification.deleteMany({ offer: { $in: offerIds } });

  return NextResponse.json({ success: true });
}