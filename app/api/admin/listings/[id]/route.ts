import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Listing } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded || decoded.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  await Listing.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}