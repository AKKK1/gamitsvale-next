import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(decoded.id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const index = user.savedListings.indexOf(params.id as any);
  if (index > -1) {
    user.savedListings.splice(index, 1);
  } else {
    user.savedListings.push(params.id as any);
  }

  await user.save();
  return NextResponse.json({ saved: index === -1 });
}