import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';
import { CONFIG } from '@/lib/config';

export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(decoded.id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const lastTopUp = (user as any).lastBalanceTopUp;
  if (lastTopUp) {
    const hoursSince = (Date.now() - new Date(lastTopUp).getTime()) / (1000 * 60 * 60);
    if (hoursSince < CONFIG.BALANCE.TOP_UP_COOLDOWN_HOURS) {
      const hoursLeft = Math.ceil(CONFIG.BALANCE.TOP_UP_COOLDOWN_HOURS - hoursSince);
      return NextResponse.json(
        { error: `${hoursLeft} საათში ერთხელ შეიძლება` },
        { status: 429 }
      );
    }
  }

  user.balance += CONFIG.BALANCE.TOP_UP_AMOUNT;
  (user as any).lastBalanceTopUp = new Date();
  await user.save();
  return NextResponse.json(user);
}